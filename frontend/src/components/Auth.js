import React, { useEffect, useState } from 'react';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Auth({ onUserChange }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (onUserChange) onUserChange(firebaseUser);
    });
    return () => unsubscribe();
  }, [onUserChange]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div className="flex justify-center mt-8 mb-8">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 flex flex-col items-center gap-4 w-full max-w-xs">
          <img src={user.photoURL} alt="avatar" className="w-20 h-20 rounded-full border-2 border-blue-400 mb-2" />
          <div className="flex-1 text-center">
            <div className="font-semibold text-lg">Welcome, {user.displayName}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>
          <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-2xl px-10 py-8 flex flex-col items-center w-full max-w-md">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_%22G%22_Logo.svg" alt="Google" className="w-12 h-12 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-blue-700">AI Bookmark Organizer</h1>
        <p className="mb-6 text-gray-600 text-center">Sign in with Google to save and summarize your favorite links!</p>
        <button onClick={handleSignIn} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow transition">
          <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.73 5.1 2.69 12.55l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.18 5.59C43.98 37.36 46.1 31.41 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.75c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.7 16.09 0 19.96 0 24c0 4.04.7 7.91 2.69 11.8l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.18-5.59c-2.01 1.35-4.59 2.15-8.72 2.15-6.43 0-11.87-3.63-14.33-8.85l-7.98 6.2C6.73 42.9 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 