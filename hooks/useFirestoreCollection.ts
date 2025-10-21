import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, QuerySnapshot, DocumentData, Timestamp } from 'firebase/firestore';

// Helper to convert Firestore Timestamps to Date objects after reading from DB
const convertTimestampsToDates = (data: DocumentData) => {
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] instanceof Timestamp) {
      newData[key] = newData[key].toDate();
    }
  }
  return newData;
};

export const useFirestoreCollection = <T,>(collectionPath: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !collectionPath) {
        setData([]);
        setLoading(false);
        return;
    };

    setLoading(true);
    const collectionRef = collection(db, collectionPath);

    const unsubscribe = onSnapshot(collectionRef, (snapshot: QuerySnapshot<DocumentData>) => {
      const collectionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as T[];
      setData(collectionData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching collection ${collectionPath}:`, error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionPath]);

  return { data, loading };
};