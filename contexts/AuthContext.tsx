import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from '../firebase';
import { type User } from '../types';
import { createUserDataOnSignup, updateUserDocument } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  loginAsGuest: () => void;
  updateUserProfile: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        console.warn("Firebase Auth is not initialized. Running in offline mode.");
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        setUser(firebaseUser);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string) => {
    if(!auth) return Promise.reject("Firebase not initialized");
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await createUserDataOnSignup(userCredential.user);
    return userCredential;
  };

  const login = (email: string, pass: string) => {
    if(!auth) return Promise.reject("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const loginAsGuest = () => {
    setUser({
      uid: 'guest',
      isGuest: true,
      email: 'guest@example.com',
      displayName: 'Guest User'
    });
  };

  const logout = () => {
    if (!auth) { // Handle guest logout
        setUser(null);
        return Promise.resolve();
    }
    return signOut(auth);
  };
  
  const signInWithGoogle = async () => {
    if(!auth) return Promise.reject("Firebase not initialized");
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDataOnSignup(result.user);
    return result;
  };
  
  const resetPassword = (email: string) => {
    if(!auth) return Promise.reject("Firebase not initialized");
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (newName: string) => {
    if (auth?.currentUser && !user?.isGuest) {
      await updateProfile(auth.currentUser, { displayName: newName });
      await updateUserDocument(auth.currentUser.uid, { displayName: newName });
      // The onAuthStateChanged listener will pick up the change and update the user state.
      // For immediate feedback, we can manually update the state here.
      if (auth.currentUser) {
          setUser({ ...auth.currentUser });
      }
    }
  };


  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    resetPassword,
    loginAsGuest,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};