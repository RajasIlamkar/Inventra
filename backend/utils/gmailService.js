const fs = require('fs');
const path = require('path');
const http = require('http');
const { google } = require('googleapis');
const open = (...args) => import('open').then(m => m.default(...args));
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config();

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MONGO_URI = process.env.MONGO_URI;

const Order = require('../models/Order');

// ----- Gmail OAuth2 Authorization -----
function authorize() {
  const credentials = JSON.parse(process.env.GMAIL_CREDENTIALS);
  const token = JSON.parse(process.env.GMAIL_TOKEN);

  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);
  return Promise.resolve(oAuth2Client);
}


// ----- Extract order from email text using Groq -----
async function extractOrderFromText(emailText) {
  const prompt = `
You are an assistant that extracts structured order data from customer emails. (Convert product to singular form if plural)

Email:
"""${emailText}"""

Respond ONLY with JSON in this format:
{
  "customer": "string",
  "items": [
    { "product": "string", "quantity": number }
  ],
  "sentiment": "positive" | "neutral" | "negative"
}
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
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
}

// ----- Fetch Emails and Save Orders -----
async function fetchEmails() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  console.log('✅ Connected to MongoDB');

  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  const profileRes = await gmail.users.getProfile({ userId: 'me' });
  const userEmail = profileRes.data.emailAddress;

  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 5,
  });

  const messages = res.data.messages || [];
  console.log(`📨 Found ${messages.length} messages:\n`);

  for (const msg of messages) {
    const { data } = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full',
    });

    const subjectHeader = data.payload.headers.find(h => h.name === 'Subject');
    const subject = subjectHeader ? subjectHeader.value : 'No subject';
    const snippet = data.snippet;

    console.log(`📬 Subject: ${subject}`);

    try {
      const parsedOrder = await extractOrderFromText(snippet);

      const fromHeader = data.payload.headers.find(h => h.name === 'From');
      const sender = fromHeader ? fromHeader.value : 'Unknown';

      const newOrder = new Order({
        customerName: parsedOrder.customer || sender || 'Unknown',
        emailText: snippet,
        sentiment: parsedOrder.sentiment,
        items: parsedOrder.items,
        status: 'pending',
        userEmail,
      });

      await newOrder.save();
      console.log('✅ Order saved to DB:', newOrder);
    } catch (err) {
      console.error('❌ Failed to parse or save:', err.message);
    }

    console.log('---');
  }
}

// ✅ ONLY export, no direct execution
module.exports = { fetchEmails };

