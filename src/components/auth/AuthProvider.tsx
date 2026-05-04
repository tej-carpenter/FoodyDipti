"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { firebaseAuth, getAdminEmails } from '@/lib/firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const adminEmails = getAdminEmails();

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    isAdmin: Boolean(user?.email && adminEmails.includes(user.email.toLowerCase())),
    signIn: async (email, password) => {
      if (!firebaseAuth) throw new Error('Firebase is not configured.');
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    },
    signUp: async (name, email, password) => {
      if (!firebaseAuth) throw new Error('Firebase is not configured.');
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credential.user, { displayName: name });
    },
    signInWithGoogle: async () => {
      if (!firebaseAuth) throw new Error('Firebase is not configured.');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    },
    resetPassword: async (email) => {
      if (!firebaseAuth) throw new Error('Firebase is not configured.');
      if (!email.trim()) throw new Error('Please enter your email first.');
      await sendPasswordResetEmail(firebaseAuth, email.trim());
    },
    signOut: async () => {
      if (!firebaseAuth) return;
      await signOut(firebaseAuth);
    },
  }), [adminEmails, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}