function getStrategyPrompt(protocolData) {
    return `
        Given the following DeFi protocol data:
        ${JSON.stringify(protocolData, null, 2)}

        Analyze the data and recommend a course of action. The possible actions are:
        - CREATE_STRATEGY: If a new, promising opportunity is found.
        - EXECUTE_STRATEGY: To allocate funds to an existing strategy.
        - REBALANCE_STRATEGY: To adjust an existing strategy.
        - NO_ACTION: If the current allocations are optimal.

        Your response should be a JSON object with the following format:
        {
            "action": "<ACTION_NAME>",
            // Include other necessary parameters based on the action
            // e.g., for CREATE_STRATEGY:
            "protocol": "<protocol_address>",
            "token": "<token_address>",
            "riskScore": <risk_score>
        }
    `;
}

module.exports = { getStrategyPrompt };
