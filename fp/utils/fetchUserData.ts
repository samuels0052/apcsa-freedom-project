import firestore from "@react-native-firebase/firestore";

export async function fetchUserWithUsername(username: string) {
  try {
    const snapshot = await firestore()
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    return userDoc.data();
  } catch (error) {
    if (error as Error) {
      console.error(error);
      return null;
    }
  }
}

export async function fetchUserWithUID(uid: string) {
  try {
    const snapshot = await firestore().collection("users").doc(uid).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data();
  } catch (error) {
    if (error as Error) {
      console.error(error);
      return null;
    }
  }
}
