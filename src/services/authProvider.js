import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// contextの作成
export const AuthContext = React.createContext();

/**
 * A provider for accessing to Firebase Auth
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isReady, setIsReady] = useState(false);

  /**
   * Sign-in method with Google
   */
  const signInWithRedirect = async () => {
    try {
      setIsReady(false);
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithRedirect(provider);
    } catch (error) {
      alert(error);
    }
  };

  /**
   * Sign-out
   */
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((result) => {
      setCurrentUser(result);
      setIsReady(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInWithRedirect: signInWithRedirect,
        signOut: signOut,
        currentUser,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
