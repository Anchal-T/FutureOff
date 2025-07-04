function getStrategyPrompt(protocolData) {
    return `
        You are a DeFi yield optimization AI. Analyze the following real-time protocol data and make strategic decisions:
        ${JSON.stringify(protocolData, null, 2)}

        DECISION CRITERIA:
        1. CREATE_STRATEGY: If APY > 4% and TVL > $100M (indicates good liquidity and yield)
        2. REBALANCE: If there's a >1% APY difference between current best and alternatives
        3. EXECUTE_STRATEGY: If strategy exists but needs more allocation
        4. NO_ACTION: Only if all protocols have APY < 3% or TVL < $50M

        RISK SCORING:
        - Low risk (1000-1999): APY 3-5%, TVL > $1B
        - Medium risk (2000-2999): APY 5-8%, TVL $100M-$1B  
        - High risk (3000-4999): APY > 8%, TVL < $100M

        Return ONLY valid JSON array with multiple strategies if beneficial:

        Example response:
        [
            {
                "action": "CREATE_STRATEGY",
                "protocol": "actual_protocol_address_from_data",
                "token": "actual_token_address_from_data", 
                "riskScore": 2500,
                "expectedApy": 5.2,
                "reasoning": "High APY with good TVL"
            },
            {
                "action": "REBALANCE",
                "fromProtocol": "lower_apy_protocol",
                "toProtocol": "higher_apy_protocol",
                "percentage": 50
            }
        ]

        IMPORTANT: Use the ACTUAL protocol and token addresses from the provided data, not placeholders.
        Return only valid JSON, nothing else.
    `;
}

module.exports = { getStrategyPrompt };
