// backend/aiParser.js
require('dotenv').config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function extractOrderFromText(text) {
  const prompt = `
You are an AI assistant that extracts structured order information from unstructured emails.

Email:
"""${text}"""

Return a JSON in this format:
{
  "customer": "Unknown",
  "items": [
    { "product": "string", "quantity": number }
  ],
  "sentiment": "positive|neutral|negative"
}

(Convert the product string to singular if it is plural)
`;

  const response = await axios.post(
    GROQ_ENDPOINT,
    {
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { extractOrderFromText };
