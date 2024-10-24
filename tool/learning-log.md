# Tool Learning Log

## Tool: **React Native**

## Project: **Mobile App for Seniors**

---

### 10/5/24:

- Discovered that expo is the most popular framework for React Native, promoted on the official documentation
- React Native allows you to compile apps into ios and android
- Learned that big apps such as discord are build on react native
- Was successfuly able to setup test project
- Learned that you can test run app on mobile by scanning qr code in terminal and downloading expo app
- Tomorrow I am going to start following the tutorial
- Are there native swift features such as notification handling?
- https://youtu.be/gvkqT_Uoahw?si=OIrGkkBx5R22gmnD

### 10/6/24:

- Error: "Error: EMFILE: too many open files, watch
  at FSEvent.FSWatcher.\_handle.onchange (node:internal/fs/watchers:207:21)"
  - Prevents project from running
  - Fixed when I changed npm version from 10.9.0 to 9.9.3
- Similar to how Next JS has page.tsx, React Native has app/index.tsx that acts as the main page
- You use `npx expo start` to run app
  - You can press w in terminal to run app in web
  - Tried scanning qr code to run app on phone, worked
- Style elements using style objects
  ```js
  const styles = StyleSheet.create({
  container: {
   flex: 1,
   /* @tutinfo Add the value of <CODE>backgroundColor</CODE> property with <CODE>'#25292e'</CODE>.*/
   backgroundColor: "#25292e",
   alignItems: "center",
   justifyContent: "center",
  },
  text: {
   color: "#fff",
  },
  ```
- Followed doc tutorial to style and run app
- https://docs.expo.dev/tutorial/create-your-first-app/

10/16/24:

- https://reactnative.dev/docs/components-and-apis#user-interface
- Read about the different components
- User Interface
  - Button: Handles touches and can render on any platform
  - Switch: boolean
- List Views: can only render components that are already showing on screen
  - FlatList: Good for scrollable lists
  - SectionLists: same as flat lists but for organized sections across app
- Other
  - ActivityIndicator: dispolays loading indicator
  - Alert: launches alert dialog similar to in HTML
  - Animated: animation library to create animations in apps
  - Modal: used to prevent content from going beyond a specific point on the screen
- I want to research more into the IOS specific components

10/18-22/24:

- Watched tutorial on basic To-DO list in react native
- https://youtu.be/0kL6nhutjQ8?si=oLlfbnAyKeS8qudO
- Modified the CSS to learn how styles works
- Had a challenging time understanding how to set the tasks without using an array and then realized it was the same as regular Next JS or React Development where you need to use components
- Realized that my component knowledge of react carries over here
- Was able to test app in the web
- How to make responsive across screen sizes? Is it any different then just using flex?

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

<!--
* Links you used today (websites, videos, etc)
* Things you tried, progress you made, etc
* Challenges, a-ha moments, etc
* Questions you still have
* What you're going to try next
-->
