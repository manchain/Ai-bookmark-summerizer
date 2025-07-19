# AI-Enhanced Bookmark Organizer

A fullstack web app to save, summarize, and organize bookmarks using Google Gemini, IDX, and Firebase. Built with React (frontend) and Node.js (API) as Vercel serverless functions.

---

## Features
- Google Sign-In authentication
- Save and categorize web bookmarks
- AI-powered summaries and tag suggestions (Gemini API)
- Bookmarks linked to decentralized identity (IDX)
- Data storage in Firebase Realtime Database
- Modern, responsive UI (Tailwind CSS)

---

## 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) (or npm)
- [Firebase Project](https://console.firebase.google.com/)
- [Google Gemini API Key](https://ai.google.dev/)
- [Vercel Account](https://vercel.com/) (for deployment)

---

## 2. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-enhanced-bookmark-organizer
```

---

## 3. Environment Variables
Create a `.env` file in the project root with the following:

```
GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
CERAMIC_API_URL=https://ceramic-clay.3boxlabs.com
```
- **Never commit your .env file!**
- For Vercel, add these in the dashboard under Project > Settings > Environment Variables.

---

## 4. Install Dependencies
```bash
yarn install
```

---

## 5. Run Locally
### Start the backend (API):
Vercel serverless functions run only in production, but for local dev, you can use Express:
```bash
yarn backend
# or
node index.js
```

### Start the frontend (React):
```bash
yarn start
```
- The app will open at [http://localhost:3000](http://localhost:3000)
- The frontend will proxy API requests to the backend (port 5001) via the `proxy` field in `package.json`.

---

## 6. Build for Production
```bash
yarn build
```
- This creates a `build/` directory with static files for deployment.

---

## 7. Deploy to Vercel
1. **Push your code to GitHub/GitLab.**
2. **Import your repo into Vercel.**
3. **Set environment variables** in the Vercel dashboard.
4. **Vercel will auto-detect:**
   - Frontend: built from `package.json` (`yarn build`)
   - Backend: all files in `api/` as serverless functions
5. **After deployment:**
   - Frontend: `https://your-app.vercel.app/`
   - API: `https://your-app.vercel.app/api/bookmarks`

---

## 8. Project Structure
```
ai-enhanced-bookmark-organizer/
  api/
    bookmarks.js        # Serverless API endpoint
  public/
    index.html          # React entry point
    ...
  src/
    App.jsx, index.js   # React app source
    components/
  .env                  # Environment variables (not committed)
  package.json
  vercel.json           # Vercel config
  README.md
```

---

## 9. Troubleshooting
- **Blank page after deploy:** Check Vercel build logs, browser console, and ensure all env vars are set.
- **API 404s:** Make sure your API files are in `api/` and named correctly (e.g., `bookmarks.js`).
- **CORS errors:** CORS is enabled in the backend handler.
- **Firebase errors:** Ensure your Firebase credentials are correct and Firestore/Realtime Database is enabled.

---

## 10. Customization
- Add more endpoints by creating new files in `api/` (e.g., `api/summarize.js`).
- Update UI in `src/` as needed.

---

## 11. License
MIT 
