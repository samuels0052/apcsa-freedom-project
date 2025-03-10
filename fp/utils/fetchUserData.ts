import { firestore } from "../firebase.config";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export async function fetchUserWithUsername(username: string) {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    return userDoc.data();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return null;
    }
  }
}

export async function fetchUserWithUID(uid: string) {
  try {
    const userDoc = doc(firestore, "users", uid);
    const snapshot = await getDoc(userDoc);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return null;
    }
  }
}
