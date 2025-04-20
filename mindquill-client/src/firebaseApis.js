// src/api.js
import axios from "axios";
import { auth } from "./firebase";

export const callProtectedRoute = async () => {
  const idToken = await auth.currentUser.getIdToken();
  const res = await axios.get("http://localhost:5000/api/protected", {
    headers: { Authorization: `Bearer ${idToken}` }
  });
  console.log(res.data);
};
