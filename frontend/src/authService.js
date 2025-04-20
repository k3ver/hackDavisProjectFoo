import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential; 
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Removed token verification to avoid failing without backend
    return userCredential;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const observeUser = (callback) =>
  onAuthStateChanged(auth, callback);

// Optional: Keep for later if you implement backend verification
export const verifyToken = async (user) => {
  try {
    if (!user) {
      throw new Error("No user is signed in.");
    }

    const token = await user.getIdToken();
    const response = await fetch("/verify-token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.status !== "success") {
      throw new Error("Token verification failed.");
    }
    console.log("Token verified successfully:", result);
    return result;
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
};
