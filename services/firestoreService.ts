import { db } from '../firebase';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { type User as FirebaseUser } from 'firebase/auth';

// Helper to convert Date objects to Firestore Timestamps before writing to DB
const convertDatesToTimestamps = (data: any) => {
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] instanceof Date) {
      newData[key] = Timestamp.fromDate(newData[key]);
    }
  }
  return newData;
};

// Check if user data exists, if not, create it (e.g., for new signups)
export const createUserDataOnSignup = async (user: FirebaseUser) => {
  if (!db) return;
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Student',
      createdAt: Timestamp.now(),
    });
  }
};

// Generic function to add a document to a user's subcollection
export const addDocument = async <T>(userId: string, collectionName: string, data: T) => {
  if (!db) return Promise.reject('Firestore not initialized');
  const collectionRef = collection(db, 'users', userId, collectionName);
  const dataWithTimestamps = convertDatesToTimestamps(data);
  return await addDoc(collectionRef, dataWithTimestamps);
};

// Generic function to update a document in a user's subcollection
export const updateDocument = async <T>(userId: string, collectionName: string, docId: string, data: T) => {
  if (!db) return Promise.reject('Firestore not initialized');
  const docRef = doc(db, 'users', userId, collectionName, docId);
  const dataWithTimestamps = convertDatesToTimestamps(data);
  return await setDoc(docRef, dataWithTimestamps, { merge: true });
};

// Generic function to delete a document from a user's subcollection
export const deleteDocument = async (userId: string, collectionName: string, docId: string) => {
  if (!db) return Promise.reject('Firestore not initialized');
  const docRef = doc(db, 'users', userId, collectionName, docId);
  return await deleteDoc(docRef);
};

// Function to update the top-level user document
export const updateUserDocument = async (userId: string, data: { displayName?: string }) => {
  if (!db) return Promise.reject('Firestore not initialized');
  const userDocRef = doc(db, 'users', userId);
  return await setDoc(userDocRef, data, { merge: true });
};