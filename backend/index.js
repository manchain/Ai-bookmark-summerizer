const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); // For fetching article content

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin SDK setup
const admin = require('firebase-admin');
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID, // from .env
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // from .env
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // from .env
    }),
    databaseURL: 'https://ai-bookmarker-21536-default-rtdb.asia-southeast1.firebasedatabase.app', // your Realtime Database URL
  });
}
const db = admin.database(); // Use Realtime Database

// Gemini API setup
const { GoogleGenerativeAI } = require('@google/generative-ai');
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // from .env

// IDX/Ceramic setup
const { CeramicClient } = require('@ceramicnetwork/http-client');
const { IDX } = require('@ceramicstudio/idx');
const ceramic = new CeramicClient(process.env.CERAMIC_API_URL); // from .env
const idx = new IDX({ ceramic });

// Helper: Fetch article content (simple version)
async function fetchArticleContent(url) {
  try {
    const response = await axios.get(url);
    // This is a naive approach; for production, use a proper readability library
    return response.data;
  } catch (error) {
    return '';
  }
}

// Health check
app.get('/', (req, res) => {
  res.send('AI-Enhanced Bookmark Organizer backend is running.');
});

// Route: Add a bookmark (summarize with Gemini, tag, store in Realtime Database under DID)
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { url, userId } = req.body;
    if (!url || !userId) return res.status(400).json({ error: 'url and userId required' });

    // 1. Get or create DID for user
    let did = userId;

    // 2. Fetch article content
    const content = await fetchArticleContent(url);
    if (!content) return res.status(400).json({ error: 'Could not fetch article content' });

    // 3. Summarize with Gemini
    let summary = '';
    let tags = [];
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Summarize this article and suggest 3 relevant tags:\n${content}`;
      const result = await model.generateContent(prompt);
      summary = result.response.text();
      const tagMatch = summary.match(/#\w+/g);
      tags = tagMatch ? tagMatch.map(t => t.replace('#', '')) : [];
    } catch (e) {
      summary = 'Could not summarize.';
      tags = [];
    }

    // 4. Store in Realtime Database
    const ref = db.ref('bookmarks').push();
    const bookmark = {
      url,
      summary,
      tags,
      userId,
      did,
      createdAt: new Date().toISOString(),
    };
    await ref.set(bookmark);

    res.json({ id: ref.key, ...bookmark });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Summarize a URL/article with Gemini
app.post('/api/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize this:\n${content}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Get or create IDX identity for user
app.get('/api/identity', async (req, res) => {
  try {
    // In a real app, authenticate and use wallet; here, just demo
    // const did = await idx.auth(userWallet)
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    // For demo, return userId as DID
    const did = userId;
    res.json({ did });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 