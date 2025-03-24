import { firestore } from "../firebase.config";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";

export async function sendMessage(
  message: string,
  author: string,
  timestamp: string
) {
  try {
    const hash = CryptoJS.AES.decrypt(message, "insert key here");
    const messageDoc = doc(firestore, "messages");
    await setDoc(messageDoc, {
      content: hash,
      author: author,
      timestamp: timestamp,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}
