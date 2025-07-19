// ✅ server/utils/gmailService.js
async function fetchEmails() {
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

// ✅ Use your central Order model
const Order = require('../models/Order');

// ----- Gmail OAuth2 Authorization -----
function authorize() {
  const credentials = JSON.parse(process.env.GMAIL_CREDENTIALS);
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // ✅ Try to load token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(process.env.GMAIL_TOKEN);
    oAuth2Client.setCredentials(token);
    return Promise.resolve(oAuth2Client);
  }

  // 🧨 If no token, start OAuth flow (only works in CLI)
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', 
    });
    

    const server = http.createServer(async (req, res) => {
      if (req.url.includes('/oauth2callback')) {
        const url = new URL(req.url, 'http://localhost:3000');
        const code = url.searchParams.get('code');
        res.end('Authentication successful! You can close this window.');
        server.close();

        try {
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
          resolve(oAuth2Client);
        } catch (err) {
          reject(err);
        }
      }
    }).listen(3000, () => {
      open(authUrl);
    });
  });
}


// ----- LLaMA Parsing -----
async function extractOrderFromText(emailText) {
  const prompt = `
You are an assistant that extracts structured order data from customer emails.(Convert the product string to singular if it is plural)

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

// ----- Fetch Emails + Save to DB -----
async function fetchEmails() {
  if (mongoose.connection.readyState === 0) {
  await mongoose.connect(MONGO_URI);
}

  console.log('✅ Connected to MongoDB');

  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });

  // ✅ Get user's Gmail profile
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
        customerName: parsedOrder.customer || sender|| 'Unknown',
        emailText: snippet,
        sentiment: parsedOrder.sentiment,
        items: parsedOrder.items,
        status: 'pending',
        userEmail, // ✅ Now tracked
      });

      await newOrder.save();
      console.log('✅ Order saved to DB:', newOrder);
    } catch (err) {
      console.error('❌ Failed to parse or save:', err.message);
    }

    console.log('---');
  }

  
}

fetchEmails().catch(console.error);

}

module.exports = { fetchEmails };
