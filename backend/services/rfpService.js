// Service for RFP/RFI text generation
// TODO: Integrate with LLM API (e.g., Gemini, OpenAI) and add compliance logic

const promptBuilder = require('../utils/promptBuilder');
const gemini = require('./llmGeminiService');
const groq = require('./llmGroqService');

exports.generateRFPText = async (userInput) => {
  // Build a detailed prompt for the LLM
  const prompt = promptBuilder.buildRfpPrompt(userInput);
  // Use Gemini by default, can switch to Groq if needed
  // const rfpText = await groq.generateText(prompt);
  const rfpText = await gemini.generateText(prompt);
  return rfpText;
};
