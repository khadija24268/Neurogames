// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA26IzVBF-YWTkWiFe_ANHrcUJVakekRPY",
  authDomain: "neurogames-440810.firebaseapp.com",
  projectId: "neurogames-440810",
  storageBucket: "neurogames-440810.firebasestorage.app",
  messagingSenderId: "1014444444444",
  appId: "1:777048124289:android:5061412b380d93f6ead680"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
