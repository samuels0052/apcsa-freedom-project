import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { auth, firestore } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import * as Crypto from "expo-crypto";
import { fetchUserWithUsername } from "../utils/fetchUserData";
import DatePicker from "react-native-date-picker";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const signUp = async () => {
    setLoading(true);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Email must be in a valid format!");
      setLoading(false);
      return;
    }

    const d = new Date();
    if (
      d.toLocaleDateString("en-US") === birthday.toLocaleDateString("en-US")
    ) {
      alert("Must set birthday!");
      setLoading(false);
      return;
    }

    if (/[^a-zA-Z0-9]/.test(username)) {
      alert("Username can only contain letters or numbers!");
      setLoading(false);
      return;
    }

    const doesUsernameExist = await fetchUserWithUsername(username);
    if (doesUsernameExist) {
      alert("This username is taken!");
      setLoading(false);
      return;
    }

    if (/[^a-zA-Z0-9]/.test(firstName)) {
      alert("First Name can only contain letters or numbers!");
      setLoading(false);
      return;
    }

    if (/[^a-zA-Z0-9]/.test(lastName)) {
      alert("Last Name can only contain letters or numbers!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    try {
      const pfpSalt = Math.floor(Math.random() * 100000000);
      const seed = `${pfpSalt}${username}`.toLowerCase().trim();
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        seed
      );
      const pfpHash = hash.substring(0, 12);
      const pfp = `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${pfpHash}`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, {
        firstName,
        lastName,
        username,
        uid: user.uid,
        pfp,
        email,
        friends: [],
        blocked: [],
        birthday: birthday.toLocaleDateString("en-US"),
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      const err = e as FirebaseError;
      if (err.code === "auth/email-already-in-use") {
        alert("An account is already registered under this email!");
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const err = e as FirebaseError;
      if (err.code === "auth/invalid-credential") {
        alert("Incorrect password or account does not exist!");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center mx-5">
      <KeyboardAvoidingView behavior="padding">
        <View className="m-1">
          <Text className="text-lg font-bold text-black underline">Email:</Text>
          <TextInput
            className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="jdoe@test.com"
          />
        </View>
        <View className="m-1">
          <Text className="text-lg font-bold text-black underline">
            Password:
          </Text>
          <TextInput
            className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="******"
          />
        </View>
        {isRegistering && (
          <View>
            <View className="m-1">
              <Text className="text-lg font-bold text-black underline">
                First Name:
              </Text>
              <TextInput
                className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
              />
            </View>
            <View className="m-1">
              <Text className="text-lg font-bold text-black underline">
                Last Name:
              </Text>
              <TextInput
                className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
              />
            </View>
            <View className="m-1">
              <Text className="text-lg font-bold text-black underline">
                Username:
              </Text>
              <TextInput
                className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white"
                value={username}
                onChangeText={setUsername}
                placeholder="jdoe59"
              />
            </View>
            <View className="m-1">
              <Text className="text-lg font-bold text-black underline">
                Birthday:
              </Text>
              <TextInput
                className="my-1 h-14 border border-gray-950 rounded-md p-2 bg-white text-black"
                value={birthday.toLocaleDateString("en-US")}
                placeholder="01/01/2001"
                pointerEvents="none"
                editable={false}
              />
              <Button title="Select Birthday" onPress={() => setOpen(true)} />
              <DatePicker
                modal
                open={open}
                date={birthday}
                mode="date"
                minimumDate={new Date("1900-01-01")}
                maximumDate={new Date()}
                onConfirm={(DOB) => {
                  setOpen(false);
                  setBirthday(DOB);
                }}
                onCancel={() => setOpen(false)}
              />
            </View>
          </View>
        )}
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
