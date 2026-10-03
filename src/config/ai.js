require("dotenv").config();

module.exports = {
  apiKey: process.env.AI_API_KEY || "",
  baseUrl: process.env.AI_BASE_URL || "https://token.apps.gdmuna.com/v1",
  model: process.env.AI_MODEL || "deepseek-v3.2",
  timeout: parseInt(process.env.AI_TIMEOUT) || 120000,
  temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
  maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 4000,
};
