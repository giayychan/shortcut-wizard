import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseDevConfig = {
  apiKey: 'AIzaSyCkv2Yq3V7DQrKrMfWzxXFj9gKQTVQDaQg',
  authDomain: 'shortcut-wizard-dev.firebaseapp.com',
  projectId: 'shortcut-wizard-dev',
  storageBucket: 'shortcut-wizard-dev.firebasestorage.app',
  messagingSenderId: '706099335058',
  appId: '1:706099335058:web:adf3e6a44b8c8da39d7b4b',
  measurementId: 'G-TVW6P2YW75',
  databaseURL: 'https://shortcut-wizard-dev-default-rtdb.firebaseio.com',
};

const firebaseProdConfig = {
  apiKey: 'AIzaSyBUggdIJq9AAUnbNA3Mst04kdKg_APNJ-k',
  authDomain: 'shortcut-wizard.firebaseapp.com',
  projectId: 'shortcut-wizard',
  storageBucket: 'shortcut-wizard.appspot.com',
  messagingSenderId: '14259092508',
  appId: '1:14259092508:web:07bd1addc29b0df2aeb3d9',
  measurementId: 'G-ZS08ZV5SMH',
  databaseURL: 'https://shortcut-wizard-default-rtdb.firebaseio.com',
};

const firebaseConfig =
  process.env.NODE_ENV === 'development'
    ? firebaseDevConfig
    : firebaseProdConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export { auth, db };
