const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { getStrategyPrompt } = require('../utils/promptTemplates');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

async function getStrategyRecommendation(protocolData) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = getStrategyPrompt(protocolData);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return JSON.parse(text);
}

module.exports = { getStrategyRecommendation };
