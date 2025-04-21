import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

export async function fetchUserWithUsername(username: string) {
  if (!username || typeof username !== "string") return null;

  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const snapshot = await getDocs(q);

    return snapshot.empty ? null : snapshot.docs[0].data();
  } catch (error) {
    return null;
  }
}

export async function fetchUserWithUID(uid: string) {
  if (!uid || typeof uid !== "string") return null;

  try {
    const userRef = doc(firestore, "users", uid);
    const snapshot = await getDoc(userRef);

    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    return null;
  }
}
