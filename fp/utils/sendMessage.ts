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
  timestamp: string,
  isPublic: boolean,
  target?: string
) {
  try {
    const hash = CryptoJS.AES.decrypt(message, "insert key here");
    const messageDoc = doc(firestore, "messages");
    if (isPublic) {
      await setDoc(messageDoc, {
        content: hash,
        author: author,
        timestamp: timestamp,
      });
    } else {
      await setDoc(messageDoc, {
        content: hash,
        author: author,
        timestamp: timestamp,
        target: target,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}
