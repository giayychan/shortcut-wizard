import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBUggdIJq9AAUnbNA3Mst04kdKg_APNJ-k',
  authDomain: 'shortcut-wizard.firebaseapp.com',
  projectId: 'shortcut-wizard',
  storageBucket: 'shortcut-wizard.appspot.com',
  messagingSenderId: '14259092508',
  appId: '1:14259092508:web:07bd1addc29b0df2aeb3d9',
  measurementId: 'G-ZS08ZV5SMH',
  databaseURL: 'https://shortcut-wizard-default-rtdb.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

// Initialize Google Analytics
const analytics = getAnalytics(app);

export { auth, analytics, db };
