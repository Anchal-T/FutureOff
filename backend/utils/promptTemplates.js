function getStrategyPrompt(protocolData) {
    return `
        You are a DeFi strategy optimizer. Given the following protocol data:
        ${JSON.stringify(protocolData, null, 2)}

        Analyze the data and respond with ONLY a valid JSON object. No explanations, no text before or after.

        The possible actions are:
        - CREATE_STRATEGY: If a new, promising opportunity is found
        - EXECUTE_STRATEGY: To allocate funds to an existing strategy
        - NO_ACTION: If no action is needed

        Return ONLY this JSON format:
        [{
            "action": "CREATE_STRATEGY",
            "protocol": "0x1234567890123456789012345678901234567890",
            "token": "0x1234567890123456789012345678901234567890",
            "riskScore": 2000
}]

        OR

        [{
            "action": "EXECUTE_STRATEGY",
            "strategyId": 1,
            "amount": "1000000000000000000"
}]

        OR

        [{
            "action": "NO_ACTION"
}]

        Return only valid JSON, nothing else.
    `;
}

module.exports = { getStrategyPrompt };
