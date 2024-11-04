# Entry 1
##### 11/4/24

### Content
The tools I have decided on for my project are [React Native](https://reactnative.dev/) and [Arduino](https://www.arduino.cc/). React Native is used to build mobile apps in JavaScript or TypeScript and then compile the app into iOS or Android. That way you only have to code your app once, and it allows for [React](https://react.dev/) and [Next.JS](https://nextjs.org/) developers to have an easier time switching over to mobile app development because the workflow and syntax are very similar. Arduinos are microcontroller boards that you can program using C++ to interact with different displays and controllers to create hardware devices. My project has 2 main components. The first part of my project is a mobile app for the elderly that has games to help them increase brain activity while also having social networking features to prevent isolation. My mobile app is also going to be the dashboard for smart glasses I develop using an Arduino. I am working on a live captioning device to assist the deaf and hearing impaired so conversations can be more accessible. I am trying to have a positive real-world impact with my project.

<!-- //react native -->
To start tinkering with React Native, I first read the [documentation](https://reactnative.dev/). After seeing that many popular apps, such as Discord, were coded this way, I realized that I had made a good choice. I tried Swift during the summer; however, it is very different from what I am used to, and I wanted to only write my app once, so I decided against continuing to work with it. In addition, XCode is not that great of an IDE, so I did not want to be stuck using it. When reading the React Native documentation, I found that they recommended the [expo](https://expo.dev/) framework. I followed the instructions and created a test app. I was able to compile my app and view it either as a website or on my actual phone by downloading the Expo app and scanning a QR code in my terminal. This helps my workflow because I am able to see how my device runs on an actual device instead of just on the web. I tinkered with my code by trying different components, such as `<NavigationContainer>`. This allows me to have a multipage app and works similar to my old React workflow. In general, I have found that transitioning to Next.JS has made it significantly easier to learn React Native because the folder structures are very similar but some of the components are closer to React. I also practiced using React hooks, which allowed me to make a basic to-do list starter app.

```tsx
<NavigationContainer>
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Test" component={TestScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

```tsx
const [task, setTask] = useState("");
const [tasks, setTasks] = useState<string[]>([]);

const addTask = () => {
  if (task.trim()) {
    setTasks([...tasks, task.trim()]);
    setTask("");
  }
};

const deleteTask = (index: number) => {
  const newTasks = tasks.filter((_, i) => i !== index);
  setTasks(newTasks);
};
```

To start tinkering with my Arduino I first had to learn how to work with an Arduino and what hardware I would need. I watched several [videos](https://youtu.be/yi29dbPnu28?si=oWTVs8TKYm-SKYLc) but one of the most beneficial ones was a crash course done by Mark Rober. This allowed me to understand the basic concepts of Arduino so I could move on to buying the hardware. I decided to get an Arduino Nano BLE since it had good features, including Bluetooth, which I would eventually need to connect the device to my dashboard. I also got a display; however, initially I was having issues getting anything to output. I then read some circuit diagrams and realized I was not connected to the correct pins. After following a guide, I managed to start outputing information to my screen. I noticed that I could only output about 84 readable characters at a time on my display, so I developed a C++ program to take in a message and then chunk it into 84 characters to ensure the user properly saw the chat. This would also work even if the user continued to send data to the device. It would just get added to an array, which prevented any issues. However, unfortunately, when I got my new laptop, I had initial problems that required a lot of device resets. I forgot to backup my Arduino code, so I am currently in the process of having to rewrite all the progress I made during the summer. At the time I don't have a code I can show, but that will be changing very soon.

![](./img/2.png)

### EDP
I am currently in stages **1 to 3** of the engineering design process. I have defined my issue and have begun researching and brainstorming possible solutions. One of my problems is elderly people not being able to stimulate their brains as much when they are all alone. To combat this, I plan to incorporate brain-stimulating games in my app to fix this issue. I also plan to add social networking features to prevent people from feeling so isolated. I also brainstormed a solution to hearing accessibility by starting to plan and develop smart glasses to assist with providing live captions during discussions. Although I am still researching and planning this, I do have a partially working prototype.

### Skills
One of the skills I have grown in is **how to learn**. When learning Arduino circuits, I had a challenging time understanding what each pin on the board did and how to connect it to a breadboard. I initially wasn't even able to get my display to output anything, and I wasn't sure if it was me or a bad part. However, after googling different diagrams and following along to the instructions of the display, I was able to get a working device. I learned that I had to get better at finding the proper documentation I needed and rely less on videos and more on circuit diagrams. Reading circuit diagrams was challenging at first, but as I kept reading more and more, I got better at understanding which wire goes where and connects to which pin on the Arduino. Another skill I have grown in is **embracing failure**. Learning Arduino is hard, especially in the beginning. I had to accept that there were going to be many things I did not understand, and I would need time to practice. Thankfully, I started my learning during the summer, which gave me more time. I also had to embrace failure when it came to React Native. I was not able to get anything to compile for days until I realized it was because of my npm version. I just had to accept this and then move on. I have learned how to let go of these small setbacks so I can continue with the rest of my project.

![](./img/1.png)

[Next](entry02.md)

[Home](../README.md)
