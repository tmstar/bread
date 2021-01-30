import React, { useEffect, useState, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import UserService from "./users";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// contextの作成
export const AuthContext = createContext();

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
      setIsReady(true);
    }
  };

  /**
   * Test only: Do not use in production.
   */
  const signInMock = () => {
    setCurrentUser(true);
    setIsReady(true);
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
    auth.onAuthStateChanged((user) => {
      if (user) {
        const newUser = { id: user.uid, name: user.displayName };
        UserService.add(newUser).then(() => {
          setCurrentUser(user);
          setIsReady(true);
        });
      } else {
        setIsReady(true);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInWithRedirect: signInWithRedirect,
        signInMock: signInMock,
        signOut: signOut,
        currentUser,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
