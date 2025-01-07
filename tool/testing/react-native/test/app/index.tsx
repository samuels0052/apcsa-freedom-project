import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function Index() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        placeholderTextColor="#aaa"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add Task" onPress={addTask} color="#5a9" />
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item}</Text>
            <TouchableOpacity onPress={() => deleteTask(index)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    color: "white",
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    backgroundColor: "gray",
    marginTop: 10,
  },
  taskText: {
    color: "white",
  },
  deleteText: {
    color: "red",
  },
});
