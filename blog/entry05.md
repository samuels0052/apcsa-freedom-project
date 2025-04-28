# Entry 5

##### 4/27/25

### Content

I have been working on finishing my MVP. I was still having a lot of compile issues, so I decided to focus on creating a working chat system. I also created pages for resources and games, which will be further implemented later. I had to restart my project because I kept getting compilation issues due to Firebase and React Native having conflicts, so I started from scratch. I decided to follow the official Firebase [documentation](https://firebase.google.com/docs). I was able to copy over my logic from previous attempts when creating the login page, which saved me a lot of time. I then created a `(tabs)` folder to store the authenticated pages.

When creating the chat component, I did not know how to get real-time live updates from Firestore, so I did some research until I found something in the Firestore [documentation](https://firebase.google.com/docs/firestore/query-data/listen) called `.onSnapshot()`, which is a method that runs whenever a change is made to a Firebase collection. I created a text GUI page and then used the `useEffect()` hook to check for messages in state. I then used a `useState()` hook to keep track of all the messages, which eventually gets rendered using `map` in the render component part of the file. In the future, I will work on adding games and other resources to make my app more accessible.

```tsx
useEffect(() => {
  if (!auth.currentUser) {
    return;
  }
  fetchUserWithUID(auth.currentUser.uid).then((data) => {
    if (data) setUserData(data);
  });

  const q = query(collection(firestore, "chats"), orderBy("timestamp", "asc"));
  const renderMessages = onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(chats);
  });

  return () => renderMessages();
}, []);

const handleSend = async () => {
  if (!input.trim()) return;

  if (input.trim().length > 280) {
    alert("Messages must be under 280 characters!");
    return;
  }

  await addDoc(collection(firestore, "chats"), {
    text: input.trim(),
    timestamp: Timestamp.now(),
    author: userData?.username,
    pfp: userData?.pfp,
  });

  setInput("");
};
```

### EDP

I am still in stages **6 to 7** of the engineering design process. I have created the MVP for my app and am currently working on testing features and adding beyond-MVP features. I am also asking my peers for feedback to create the best possible final product.

### Skills

One of the skills I have continued to grow in is **embracing failure**. It was very demotivating to have to basically start my project over again because I was getting too many compilation errors and the lack of relevant tutorials on YouTube. I have constantly had to deal with random errors, so it has been a challenge and a new skill to persevere through. Another skill I have grown in is **how to Google**. Because of all the random errors I get during this project, I've had to get better at tracking down the cause of the errors and Googling solutions to keep going. I've also had to get better at Googling to search through the documentation using Google dorking. Example: **site:firebase.google.com intext:"real time"**.

[Previous](entry04.md) | [Next](entry06.md)

[Home](../README.md)
