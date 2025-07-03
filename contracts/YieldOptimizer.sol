// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title YieldOptimizer
 * @dev Core contract for automated yield farming optimization
 */
contract YieldOptimizer is 
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;

    // Structs
    struct Strategy {
        address protocol;
        address token;
        uint256 allocatedAmount;
        uint256 currentYield;
        uint256 riskScore;
        uint256 lastRebalance;
        bool isActive;
    }

    struct ProtocolInfo {
        address protocolAddress;
        string name;
        uint256 tvl;
        uint256 apy;
        uint256 riskScore;
        bool isWhitelisted;
    }

    struct UserPosition {
        uint256 totalDeposited;
        uint256 currentValue;
        uint256 pendingRewards;
        uint256 lastUpdate;
        mapping(bytes32 => uint256) strategyAllocations;
    }

    // State variables
    mapping(bytes32 => Strategy) public strategies;
    mapping(address => ProtocolInfo) public whitelistedProtocols;
    mapping(address => UserPosition) public userPositions;
    mapping(address => bool) public authorizedAI;
    
    bytes32[] public activeStrategies;
    address[] public supportedTokens;
    
    uint256 public constant MAX_PROTOCOL_ALLOCATION = 3000; // 30%
    uint256 public constant MIN_YIELD_THRESHOLD = 100; // 1%
    uint256 public constant REBALANCE_THRESHOLD = 500; // 5%
    uint256 public totalAssets;
    uint256 public performanceFee; // in basis points
    uint256 public managementFee; // in basis points
    
    // Events
    event StrategyCreated(bytes32 indexed strategyId, address protocol, address token);
    event StrategyExecuted(bytes32 indexed strategyId, uint256 amount, uint256 expectedYield);
    event StrategyRebalanced(bytes32 indexed strategyId, uint256 newAllocation);
    event EmergencyExit(bytes32 indexed strategyId, uint256 amount, string reason);
    event ProtocolWhitelisted(address protocol, string name);
    event AIAuthorized(address aiAgent, bool status);
    event UserDeposit(address indexed user, address token, uint256 amount);
    event UserWithdraw(address indexed user, address token, uint256 amount);

    // Modifiers
    modifier onlyAuthorizedAI() {
        require(authorizedAI[msg.sender] || msg.sender == owner(), "Not authorized AI");
        _;
    }

    modifier validStrategy(bytes32 strategyId) {
        require(strategies[strategyId].isActive, "Strategy not active");
        _;
    }

    // Initializer
    function initialize(
        address _owner,
        uint256 _performanceFee,
        uint256 _managementFee
    ) public initializer {
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        __Pausable_init();
        
        performanceFee = _performanceFee;
        managementFee = _managementFee;
    }

    /**
     * @dev Create a new yield farming strategy
     */
    function createStrategy(
        address protocol,
        address token,
        uint256 riskScore
    ) external onlyAuthorizedAI returns (bytes32) {
        require(whitelistedProtocols[protocol].isWhitelisted, "Protocol not whitelisted");
        require(riskScore <= 10000, "Invalid risk score");

        bytes32 strategyId = keccak256(abi.encodePacked(protocol, token, block.timestamp));
        
        strategies[strategyId] = Strategy({
            protocol: protocol,
            token: token,
            allocatedAmount: 0,
            currentYield: 0,
            riskScore: riskScore,
            lastRebalance: block.timestamp,
            isActive: true
        });

        activeStrategies.push(strategyId);
        emit StrategyCreated(strategyId, protocol, token);
        
        return strategyId;
    }

    /**
     * @dev Execute a yield farming strategy
     */
    function executeStrategy(
        bytes32 strategyId,
        uint256 amount
    ) external onlyAuthorizedAI validStrategy(strategyId) nonReentrant {
        Strategy storage strategy = strategies[strategyId];
        require(amount > 0, "Amount must be greater than 0");
        
        // Check allocation limits
        uint256 protocolAllocation = getProtocolAllocation(strategy.protocol) + amount;
        require(
            protocolAllocation <= (totalAssets * MAX_PROTOCOL_ALLOCATION) / 10000,
            "Exceeds protocol allocation limit"
        );

        // Update strategy
        strategy.allocatedAmount += amount;
        totalAssets += amount;

        emit StrategyExecuted(strategyId, amount, strategy.currentYield);
    }

    /**
     * @dev Rebalance strategy allocation
     */
    function rebalanceStrategy(
        bytes32 strategyId,
        uint256 newAllocation
    ) external onlyAuthorizedAI validStrategy(strategyId) {
        Strategy storage strategy = strategies[strategyId];
        
        uint256 difference = newAllocation > strategy.allocatedAmount 
            ? newAllocation - strategy.allocatedAmount
            : strategy.allocatedAmount - newAllocation;
            
        require(
            (difference * 10000) / strategy.allocatedAmount >= REBALANCE_THRESHOLD,
            "Rebalance threshold not met"
        );

        strategy.allocatedAmount = newAllocation;
        strategy.lastRebalance = block.timestamp;

        emit StrategyRebalanced(strategyId, newAllocation);
    }

    /**
     * @dev Emergency exit from a strategy
     */
    function emergencyExit(
        bytes32 strategyId,
        string calldata reason
    ) external onlyAuthorizedAI validStrategy(strategyId) {
        Strategy storage strategy = strategies[strategyId];
        uint256 amount = strategy.allocatedAmount;
        
        strategy.allocatedAmount = 0;
        strategy.isActive = false;
        totalAssets -= amount;

        emit EmergencyExit(strategyId, amount, reason);
    }

    /**
     * @dev User deposit function
     */
    function deposit(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(isTokenSupported(token), "Token not supported");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        UserPosition storage position = userPositions[msg.sender];
        position.totalDeposited += amount;
        position.lastUpdate = block.timestamp;

        emit UserDeposit(msg.sender, token, amount);
    }

    /**
     * @dev User withdrawal function
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        UserPosition storage position = userPositions[msg.sender];
        require(position.totalDeposited >= amount, "Insufficient balance");

        position.totalDeposited -= amount;
        position.lastUpdate = block.timestamp;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit UserWithdraw(msg.sender, token, amount);
    }

    /**
     * @dev Whitelist a DeFi protocol
     */
    function whitelistProtocol(
        address protocol,
        string calldata name,
        uint256 riskScore
    ) external onlyOwner {
        whitelistedProtocols[protocol] = ProtocolInfo({
            protocolAddress: protocol,
            name: name,
            tvl: 0,
            apy: 0,
            riskScore: riskScore,
            isWhitelisted: true
        });

        emit ProtocolWhitelisted(protocol, name);
    }

    /**
     * @dev Authorize AI agent
     */
    function authorizeAI(address aiAgent, bool status) external onlyOwner {
        authorizedAI[aiAgent] = status;
        emit AIAuthorized(aiAgent, status);
    }

    /**
     * @dev Update strategy yield
     */
    function updateStrategyYield(
        bytes32 strategyId,
        uint256 newYield
    ) external onlyAuthorizedAI validStrategy(strategyId) {
        strategies[strategyId].currentYield = newYield;
    }

    /**
     * @dev Get protocol allocation
     */
    function getProtocolAllocation(address protocol) public view returns (uint256) {
        uint256 totalAllocation = 0;
        for (uint i = 0; i < activeStrategies.length; i++) {
            if (strategies[activeStrategies[i]].protocol == protocol) {
                totalAllocation += strategies[activeStrategies[i]].allocatedAmount;
            }
        }
        return totalAllocation;
    }

    /**
     * @dev Check if token is supported
     */
    function isTokenSupported(address token) public view returns (bool) {
        for (uint i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get user position
     */
    function getUserPosition(address user) external view returns (
        uint256 totalDeposited,
        uint256 currentValue,
        uint256 pendingRewards,
        uint256 lastUpdate
    ) {
        UserPosition storage position = userPositions[user];
        return (
            position.totalDeposited,
            position.currentValue,
            position.pendingRewards,
            position.lastUpdate
        );
    }

    /**
     * @dev Get strategy details
     */
    function getStrategy(bytes32 strategyId) external view returns (Strategy memory) {
        return strategies[strategyId];
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}