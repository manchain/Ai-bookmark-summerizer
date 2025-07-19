// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDn_e1c6tlZjvl3G56S8j2__q1I6NmPYSU',
  authDomain: 'ai-bookmarker-21536.firebaseapp.com',
  projectId: 'ai-bookmarker-21536',
  storageBucket: 'ai-bookmarker-21536.firebasestorage.app',
  messagingSenderId: '539006847090',
  appId: '1:539006847090:web:6a354e83184ced5cc7daeb',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; 