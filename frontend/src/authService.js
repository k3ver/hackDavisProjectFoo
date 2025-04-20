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
    await verifyToken(userCredential.user); // Verify token after signup
    return userCredential; // Return userCredential if you need it
  } catch (error) {
    console.error("Sign up error:", error);
    throw error; // Handle signup errors
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await verifyToken(userCredential.user); // Verify token after sign-in
    return userCredential; // Return userCredential if you need it
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error; // Handle sign-in errors
  }
};

export const logout = () => signOut(auth);

export const observeUser = (callback) =>
  onAuthStateChanged(auth, callback);

// New function to verify the Firebase token with the backend
export const verifyToken = async (user) => {
  try {
    if (!user) {
      throw new Error("No user is signed in.");
    }

    // Retrieve the user's token
    const token = await user.getIdToken();

    // Send the token to your backend for verification
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
    return result; // You can handle the result here or return it for use in the component
  } catch (error) {
    console.error("Token verification error:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};
