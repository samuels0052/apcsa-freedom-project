import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import firestore from "@react-native-firebase/firestore";
import * as Crypto from "expo-crypto";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      const pfp = `https://api.dicebear.com/9.x/initials/png?seed="${firstName.substring(
        0,
        1
      )}${lastName.substring(0, 1)}"`;

      const update = {
        displayName: `${firstName} ${lastName}`,
        photoURL: pfp,
      };
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await user.updateProfile(update);

      try {
        const docRef = firestore().collection("users").doc(user.uid);
        const randValue = Math.random().toString(36).substring(2, 15);
        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          randValue + user.uid
        );
        const genUsername = hash.substring(0, 12);
        await docRef.set({
          firstName: firstName,
          lastName: lastName,
          username: genUsername,
          email: email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.error(error);
      }

      alert("Success!");
    } catch (e) {
      const err = e as FirebaseError;
      if (
        err.message ===
        "[auth/email-already-in-use] The email address is already in use by another account."
      ) {
        alert("This email is already used! Please try a different email!");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      const err = e as FirebaseError;
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        {isRegistering && (
          <View>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
            />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
            />
          </View>
        )}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="jdoe@test.com"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
        />
        {loading ? (
          <ActivityIndicator size="small" style={{ margin: 28 }} />
        ) : (
          <>
            {isRegistering ? (
              <Button onPress={signUp} title="Create Account" />
            ) : (
              <Button onPress={signIn} title="Login" />
            )}
            <Button
              onPress={() => setIsRegistering(!isRegistering)}
              title={isRegistering ? "Switch to Login" : "Switch to Register"}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
