# Entry 3

##### 2/10/25

### Content

I have been learning my tool by following a [tutorial](https://galaxies.dev/react-native-firebase-authentication-expo-router#creating-a-firebase-project) by Simon Grimm. This was one of the first tutorials I've come across to break down how to handle user authentication, and it has allowed me to understand how user authentication and protected routes work. The project layout has a `_layout.tsx` file that checks when the `authState` changes, indicating whether a user has logged in. This will cause the user to be redirected to the main page away from any protected routes if they are not logged in. I have also learned that protected routes in `expo` projects are managed in the `(auth)` directory and contain all the protected files. In the future, I will change the code once I can compile my code and fix [Cocoapods](https://stackoverflow.com/questions/77862831/installing-cocoapods-on-an-m3-mac-with-sonoma-fails-with-no-error-message). This is a package that allows for IOS simulations on mac and has been preventing most of my progress. I have been following along with solutions, but none of them have worked so far.

```tsx
useEffect(() => {
  const user = auth().onAuthStateChanged(onAuthStateChanged);
  return user;
}, []);

useEffect(() => {
  if (initializing) return;

  const inAuthGroup = segments[0] === "(auth)";

  if (user && !inAuthGroup) {
    router.replace("/(auth)/home");
  } else if (!user && inAuthGroup) {
    router.replace("/");
  }
}, [user, initializing]);
}
```

I have not made any progress on the React Native side since winter break due to being busy with other commitments. It is also really challenging to find good tutorials for what I need, and I am constantly dealing with new issues, which has been slowing down my morale and production. For example, you need to use **XCode** to compile an app on IOS. However, I have been having issues because I have an _M-series Macbook_. I need to fix my simulation and compilation issues permanently before trying to learn more about my tool. But one specific thing I do want to learn is [ActionSheetIOS](https://reactnative.dev/docs/actionsheetios). This can make my app more interactive, which makes me excited to learn it.

### EDP

I am still in stages **4 to 5** of the engineering design process. I am still planning and creating a prototype, but I am still experiencing issues with software compilation. I am constantly having to restart my progress, which is slowing down development, but I will try to have build issues fixed within the next week.

### Skills

One of the skills I have grown in is **embracing failure**. Throughout this project, I always encountered errors or had to restart from scratch when something broke down. I have had to learn to embrace the mistakes I face and not to allow them to get to me so that I can keep learning. For example, I have been having issues loading the IOS simulation on my computer due to missing packages. It is easy for me to give up, but instead, I keep searching for fixes on [Reddit](https://stackoverflow.com/questions/77862831/installing-cocoapods-on-an-m3-mac-with-sonoma-fails-with-no-error-message). Another skill I have grown in is **how to google**. As part of my error debugging, I have had to learn how to get better at finding solutions to my issues, which typically involve googling the error code on Reddit. Getting better at this skill has allowed me to find solutions faster.

[Previous](entry02.md) | [Next](entry04.md)

[Home](../README.md)
