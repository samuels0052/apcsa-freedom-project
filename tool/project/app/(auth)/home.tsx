import { View, Text, Button, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

const Page = () => {
  const [user, setUser] = useState(auth().currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserPhoto = async () => {
      let updatedUser = auth().currentUser;

      while (updatedUser && !updatedUser.photoURL) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await updatedUser.reload();
        updatedUser = auth().currentUser;
      }

      if (updatedUser?.photoURL) {
        setUser(updatedUser);
        setLoading(false);
      }
    };

    checkUserPhoto();
  }, []);
  console.log(user?.photoURL);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome back {user?.displayName}</Text>
      <Image
        source={{ uri: user?.photoURL }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Button title="Sign out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default Page;
