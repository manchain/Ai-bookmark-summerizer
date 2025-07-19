import React, { useState } from 'react';
import Auth from './components/Auth';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handler for adding a bookmark
  const handleAddBookmark = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/bookmarks', {
        url,
        userId: user.uid,
      });
      setBookmarks([res.data, ...bookmarks]);
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col">
      <header className="sticky top-0 z-10 w-full py-4 bg-white/80 backdrop-blur shadow flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-blue-700 tracking-tight">AI Bookmark Organizer</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        <div className="w-full max-w-xl flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center w-full">
            <Auth onUserChange={setUser} />
            {user ? (
              <div className="mt-8 p-10 bg-white rounded-2xl shadow-2xl border border-blue-100 w-full flex flex-col items-center mx-auto">
                <form onSubmit={handleAddBookmark} className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center items-center">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Paste a URL to bookmark..."
                    className="flex-1 border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </form>
                {error && <div className="text-red-500 mb-4 text-center w-full">{error}</div>}
                <h2 className="text-xl font-bold mb-6 text-blue-700 w-full text-center">Your Bookmarks</h2>
                <ul className="space-y-6 w-full flex flex-col items-center">
                  {bookmarks.map(b => (
                    <li key={b.id} className="border border-blue-100 rounded-xl p-6 bg-blue-50 hover:shadow-lg transition w-full max-w-lg">
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all font-medium text-lg">{b.url}</a>
                      <div className="mt-2 text-gray-700 whitespace-pre-line text-base">{b.summary}</div>
                      {b.tags && b.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {b.tags.map(tag => (
                            <span key={tag} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 