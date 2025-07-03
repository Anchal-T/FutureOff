// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IYieldOptimizer
 * @dev Interface for the YieldOptimizer contract
 */
interface IYieldOptimizer {
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

    // Events
    event StrategyCreated(bytes32 indexed strategyId, address protocol, address token);
    event StrategyExecuted(bytes32 indexed strategyId, uint256 amount, uint256 expectedYield);
    event StrategyRebalanced(bytes32 indexed strategyId, uint256 newAllocation);
    event EmergencyExit(bytes32 indexed strategyId, uint256 amount, string reason);

    // Core functions
    function createStrategy(
        address protocol,
        address token,
        uint256 riskScore
    ) external returns (bytes32);

    function executeStrategy(
        bytes32 strategyId,
        uint256 amount
    ) external;

    function rebalanceStrategy(
        bytes32 strategyId,
        uint256 newAllocation
    ) external;

    function emergencyExit(
        bytes32 strategyId,
        string calldata reason
    ) external;

    function updateStrategyYield(
        bytes32 strategyId,
        uint256 newYield
    ) external;

    // View functions
    function getStrategy(bytes32 strategyId) external view returns (Strategy memory);
    function getProtocolAllocation(address protocol) external view returns (uint256);
    function isTokenSupported(address token) external view returns (bool);
    function totalAssets() external view returns (uint256);
}
