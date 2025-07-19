const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { CeramicClient } = require('@ceramicnetwork/http-client');
const { IDX } = require('@ceramicstudio/idx');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Firebase Admin SDK setup
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: 'https://ai-bookmarker-21536-default-rtdb.asia-southeast1.firebasedatabase.app',
    });
  }
}
const db = admin.database();

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const ceramic = new CeramicClient(process.env.CERAMIC_API_URL);
const idx = new IDX({ ceramic });

// Helper: Fetch article content (simple version)
async function fetchArticleContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return '';
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  cors()(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    try {
      const { url, userId } = req.body;
      if (!url || !userId) return res.status(400).json({ error: 'url and userId required' });
      let did = userId;
      const content = await fetchArticleContent(url);
      if (!content) return res.status(400).json({ error: 'Could not fetch article content' });
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
}; 