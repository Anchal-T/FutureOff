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
    
    console.log('Gemini AI Response:', text);
    
    // Strip markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Failed to parse JSON from AI response:', cleanText);
        throw new Error(`Invalid JSON response from AI: ${cleanText}`);
    }
}

module.exports = { getStrategyRecommendation };
