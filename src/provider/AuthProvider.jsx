import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import axios from "../../axiosConfig";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Register user
  // -----------------------------
  const createUser = async (email, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await sendFirebaseTokenToBackend(res.user);
    setLoading(false);
    return res;
  };

  // -----------------------------
  // Login user
  // -----------------------------
  const loginUser = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    await sendFirebaseTokenToBackend(res.user);
    setLoading(false);
    return res;
  };

  // -----------------------------
  // Update profile
  // -----------------------------
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, { displayName: name, photoURL });
  };

  // -----------------------------
  // Google login
  // -----------------------------
  const signInWithGoogle = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    await sendFirebaseTokenToBackend(res.user);
    setLoading(false);
    return res;
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logoutUser = async () => {
    setLoading(true);
    await signOut(auth);
    // Clear cookie on backend
    await axios.post(
      `${import.meta.env.VITE_API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    setLoading(false);
  };

  // -----------------------------
  // Send Firebase token to backend to get JWT cookie
  // -----------------------------
  const sendFirebaseTokenToBackend = async (firebaseUser) => {
    const firebaseToken = await firebaseUser.getIdToken();
    await axios.post(
      `${import.meta.env.VITE_API_URL}/jwt`,
      { firebaseToken },
      { withCredentials: true } // Important: to store httpOnly cookie
    );
  };

  // -----------------------------
  // Monitor Firebase auth state
  // -----------------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Send token to backend if not already done
        await sendFirebaseTokenToBackend(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    updateUserProfile,
    signInWithGoogle,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
