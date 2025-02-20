// auth.js
import { auth, firestore } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Registers a new patient and stores their details in Firestore.
 * @param {string} email - Patient's email address.
 * @param {string} password - Patient's password.
 * @param {string} name - Patient's name.
 * @param {string} age - Patient's age.
 * @param {string} diagnosis - Patient's diagnosis.
 * @param {string} contactMobile - Patient's contact mobile number.
 */
export const registerPatient = async (
  email,
  password,
  name,
  age,
  diagnosis,
  contactMobile
) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Reference to the patient document under 'patients/{uid}'
    const patientDocRef = doc(firestore, 'patients', uid);

    // Add patient details in Firestore
    await setDoc(patientDocRef, {
      name,
      age: parseInt(age),
      diagnosis,
      email,
      contactMobile,
      createdAt: serverTimestamp(),
    });

    console.log('Patient registered successfully with UID:', uid);
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Operation not allowed. Please contact support.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      default:
        errorMessage = 'Registration failed. Please try again.';
    }
    throw new Error(errorMessage);
  }
};

/**
 * Logs in a patient using email and password.
 * @param {string} email - Patient's email address.
 * @param {string} password - Patient's password.
 */
export const loginPatient = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Account disabled';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
      default:
        errorMessage = 'Login failed. Please try again';
    }
    throw new Error(errorMessage);
  }
};
/**
 * Logs in a doctor using email and password.
 * @param {string} email - Doctor's email address.
 * @param {string} password - Doctor's password.
 */
export const loginDoctor = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in doctor:', error);
    throw error;
  }
};

/**
 * Logs out the current user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Fetches all patient data from Firestore 'patients' collection.
 * @returns {Array} - List of patients.
 */
export const fetchPatients = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'patients'));
      const patientList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return patientList;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
  }
};