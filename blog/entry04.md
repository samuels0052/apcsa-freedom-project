# Entry 4

##### 3/16/25

### Content

I have been working on finishing the login system for my tool. I've had a lot of experience with Firebase in web-based projects, so for React Native, I used [this](https://galaxies.dev/react-native-firebase-auth) guide. I created a home page that served as the app's entry point. I then added logic in the `_layout.tsx` file to handle when a user's auth changes so that they can be properly redirected once successfully logging in. I then created a directory called `(auth)`, which stores the app pages only accessible once a user logs in. On the login page, there are many checks and safeguards to ensure a user creates a proper account. One of the first checks is using regex to check email format.

```ts
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  alert("Email must be in a valid format!");
  setLoading(false);
  return;
}

const doesUsernameExist = await fetchUserWithUsername(username);
if (doesUsernameExist) {
  alert("This username is taken!");
  setLoading(false);
  return;
}

if (password.length < 6) {
  alert("Password must be at least 6 characters!");
  setLoading(false);
  return;
}
```

I then check that the username is formatted correctly and has not been taken. After completing the standard checks, I start working on generating a profile picture for the user. I use a library called [dicebear](https://www.dicebear.com/introduction/). For security reasons, I don't just pass a user's name or username into the API to generate a profile picture. The first thing I do is generate a randomized salt value. I then create a seed for the picture using the salt and the user's username. I then hash that seed using the `sha256` encryption algorithm. The last step is just passing the first 12 characters of the hash into the web API. It may be overkill, but I want to ensure my users are secure. This also helps create more randomization.

```ts
const pfpSalt = Math.floor(Math.random() * 100000000);
const seed = `${pfpSalt}${username}`.toLowerCase().trim();
const hash = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  seed
);
const pfpHash = hash.substring(0, 12);
const pfp = `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${pfpHash}`;
```

There were some authentication issues when a user swiped back before logging out. I did some research and used a solution from [Reddit](https://stackoverflow.com/questions/64012470/react-navigation-v6-and-v5-disable-swipe-back-action). I went into the `layout` file for my `(auth)` directory and added an attribute to the screen preventing gestures. This fixed my issue.

```tsx
import { Stack } from "expo-router";
import "../../global.css";

const Layout = () => {
  return <Stack screenOptions={{ gestureEnabled: false }} />;
};
export default Layout;
```

### EDP

I am still in stages **4 to 5** of the engineering design process. I am developing my app and adapting as I go because some features work on one operating system, and others don't. I am constantly dealing with errors but am still pushing through to make progress.

### Skills

[Previous](entry03.md) | [Next](entry05.md)

[Home](../README.md)
