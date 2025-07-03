// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IYieldOptimizer.sol";

/**
 * @title StrategyManager
 * @dev Manages individual yield farming strategies and protocol interactions
 */
contract StrategyManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs
    struct ProtocolAdapter {
        address adapterAddress;
        string protocolName;
        bool isActive;
        uint256 totalAllocated;
        uint256 averageAPY;
    }

    struct ExecutionParams {
        address protocol;
        address token;
        uint256 amount;
        bytes data;
        uint256 minReturn;
        uint256 deadline;
    }

    // State variables
    mapping(address => ProtocolAdapter) public protocolAdapters;
    mapping(bytes32 => bool) public executedStrategies;
    
    address public yieldOptimizer;
    address[] public supportedProtocols;
    
    uint256 public constant SLIPPAGE_TOLERANCE = 100; // 1%
    uint256 public executionFee; // in basis points

    // Events
    event StrategyExecuted(
        bytes32 indexed strategyId,
        address protocol,
        uint256 amount,
        uint256 actualReturn
    );
    event ProtocolAdapterAdded(address protocol, address adapter);
    event StrategyReverted(bytes32 indexed strategyId, string reason);
    event EmergencyWithdraw(address protocol, address token, uint256 amount);

    // Modifiers
    modifier onlyYieldOptimizer() {
        require(msg.sender == yieldOptimizer, "Only YieldOptimizer can call");
        _;
    }

    modifier validProtocol(address protocol) {
        require(protocolAdapters[protocol].isActive, "Protocol not supported");
        _;
    }

    constructor(address _yieldOptimizer) {
        yieldOptimizer = _yieldOptimizer;
        executionFee = 50; // 0.5%
    }

    /**
     * @dev Execute a yield farming strategy
     */
    function executeStrategy(
        ExecutionParams calldata params
    ) external onlyYieldOptimizer validProtocol(params.protocol) nonReentrant 
      returns (uint256 actualReturn) {
        
        require(params.amount > 0, "Invalid amount");
        require(params.deadline >= block.timestamp, "Execution deadline passed");
        
        bytes32 strategyId = keccak256(abi.encodePacked(
            params.protocol,
            params.token,
            params.amount,
            block.timestamp
        ));
        
        require(!executedStrategies[strategyId], "Strategy already executed");

        // Transfer tokens from YieldOptimizer
        IERC20(params.token).safeTransferFrom(yieldOptimizer, address(this), params.amount);

        // Execute strategy through protocol adapter
        try this._executeProtocolInteraction(params) returns (uint256 result) {
            actualReturn = result;
            require(actualReturn >= params.minReturn, "Insufficient return");
            
            executedStrategies[strategyId] = true;
            protocolAdapters[params.protocol].totalAllocated += params.amount;
            
            emit StrategyExecuted(strategyId, params.protocol, params.amount, actualReturn);
        } catch Error(string memory reason) {
            // Revert tokens back to YieldOptimizer on failure
            IERC20(params.token).safeTransfer(yieldOptimizer, params.amount);
            emit StrategyReverted(strategyId, reason);
            revert(reason);
        }
    }

    /**
     * @dev Internal function to execute protocol-specific interactions
     */
    function _executeProtocolInteraction(
        ExecutionParams calldata params
    ) external returns (uint256) {
        require(msg.sender == address(this), "Internal function");
        
        ProtocolAdapter storage adapter = protocolAdapters[params.protocol];
        
        // Approve tokens for protocol interaction
        IERC20(params.token).safeApprove(adapter.adapterAddress, params.amount);
        
        // Call protocol adapter
        (bool success, bytes memory data) = adapter.adapterAddress.call(params.data);
        require(success, "Protocol interaction failed");
        
        return abi.decode(data, (uint256));
    }

    /**
     * @dev Withdraw from a specific protocol
     */
    function withdrawFromProtocol(
        address protocol,
        address token,
        uint256 amount
    ) external onlyYieldOptimizer validProtocol(protocol) nonReentrant 
      returns (uint256 actualAmount) {
        
        ProtocolAdapter storage adapter = protocolAdapters[protocol];
        
        // Call withdrawal through adapter
        bytes memory withdrawData = abi.encodeWithSignature(
            "withdraw(address,uint256)",
            token,
            amount
        );
        
        (bool success, bytes memory data) = adapter.adapterAddress.call(withdrawData);
        require(success, "Withdrawal failed");
        
        actualAmount = abi.decode(data, (uint256));
        adapter.totalAllocated -= amount;
        
        // Transfer withdrawn tokens back to YieldOptimizer
        IERC20(token).safeTransfer(yieldOptimizer, actualAmount);
    }

    /**
     * @dev Add protocol adapter
     */
    function addProtocolAdapter(
        address protocol,
        address adapter,
        string calldata protocolName
    ) external onlyOwner {
        require(protocol != address(0) && adapter != address(0), "Invalid addresses");
        
        protocolAdapters[protocol] = ProtocolAdapter({
            adapterAddress: adapter,
            protocolName: protocolName,
            isActive: true,
            totalAllocated: 0,
            averageAPY: 0
        });
        
        supportedProtocols.push(protocol);
        emit ProtocolAdapterAdded(protocol, adapter);
    }

    /**
     * @dev Update protocol status
     */
    function setProtocolStatus(address protocol, bool status) external onlyOwner {
        protocolAdapters[protocol].isActive = status;
    }

    /**
     * @dev Update protocol APY
     */
    function updateProtocolAPY(address protocol, uint256 newAPY) external onlyOwner {
        protocolAdapters[protocol].averageAPY = newAPY;
    }

    /**
     * @dev Emergency withdrawal function
     */
    function emergencyWithdraw(
        address protocol,
        address token
    ) external onlyOwner validProtocol(protocol) {
        ProtocolAdapter storage adapter = protocolAdapters[protocol];
        
        // Get balance from protocol
        bytes memory balanceData = abi.encodeWithSignature("getBalance(address)", token);
        (bool success, bytes memory data) = adapter.adapterAddress.call(balanceData);
        require(success, "Failed to get balance");
        
        uint256 balance = abi.decode(data, (uint256));
        
        if (balance > 0) {
            // Withdraw all funds
            bytes memory withdrawData = abi.encodeWithSignature(
                "emergencyWithdraw(address)",
                token
            );
            
            (success,) = adapter.adapterAddress.call(withdrawData);
            require(success, "Emergency withdrawal failed");
            
            // Transfer to owner
            IERC20(token).safeTransfer(owner(), balance);
            
            emit EmergencyWithdraw(protocol, token, balance);
        }
    }

    /**
     * @dev Get protocol information
     */
    function getProtocolInfo(address protocol) external view returns (
        address adapterAddress,
        string memory protocolName,
        bool isActive,
        uint256 totalAllocated,
        uint256 averageAPY
    ) {
        ProtocolAdapter storage adapter = protocolAdapters[protocol];
        return (
            adapter.adapterAddress,
            adapter.protocolName,
            adapter.isActive,
            adapter.totalAllocated,
            adapter.averageAPY
        );
    }

    /**
     * @dev Get all supported protocols
     */
    function getSupportedProtocols() external view returns (address[] memory) {
        return supportedProtocols;
    }

    /**
     * @dev Set execution fee
     */
    function setExecutionFee(uint256 _executionFee) external onlyOwner {
        require(_executionFee <= 1000, "Fee too high"); // Max 10%
        executionFee = _executionFee;
    }

    /**
     * @dev Calculate execution cost
     */
    function calculateExecutionCost(uint256 amount) external view returns (uint256) {
        return (amount * executionFee) / 10000;
    }
}
