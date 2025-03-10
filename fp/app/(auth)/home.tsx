import { View, Text, Button, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../../firebase.config";
import { signOut } from "firebase/auth";
import { fetchUserWithUID } from "../../utils/fetchUserData";
import { calculateAge } from "../../utils/calculateAge";

interface User {
  timestamp: string;
  email: string;
  firstName: string;
  lastName: string;
  pfp: string;
  uid: string;
  username: string;
  birthday: string;
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = await fetchUserWithUID(currentUser.uid);
        if (userData) {
          setUser(userData as User);
          const getAge: number = calculateAge(userData.birthday);
          setAge(getAge);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="flex flex-col">
      <Text className="underline">
        Welcome back {user?.firstName} {user?.lastName}
      </Text>
      <Text>You are {age}</Text>
      <Image
        source={{ uri: user?.pfp }}
        className="m-10 w-24 h-24 rounded-full"
      />
      <Button title="Sign out" onPress={() => signOut(auth)} />
    </View>
  );
};

export default Page;
