import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableNativeFeedback, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
class Task {
  task = ""; isChecked = false;
  constructor(task, isChecked, timeAdded) {
    this.task = task;
    this.isChecked = isChecked;
    this.timeAdded = timeAdded;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.InputRef = React.createRef();
    this.state = { allTasks: [], currentTask: "" }
  }

  componentDidMount() {
    this._retrieveData()
  }
  storeData = async () => {
    try {
      await AsyncStorage.setItem('allTasks', JSON.stringify(this.state.allTasks));
    } catch (error) {
      // Error saving data
    }
  };
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('allTasks');
      if (value !== null) {
        // We have data!!
        this.setState({ allTasks: JSON.parse(value) });
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  textStyle(isChecked) {
    return (
      {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: isChecked ? 'line-through' : 'none'
      }
    );
  }
  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  _addTask(tasks) {
    {
      let found = false;
      if (!this.isEmptyOrSpaces(this.state.currentTask)) {
        this.state.allTasks.forEach(element => {
          if (element.task === this.state.currentTask) {
            alert("Already in the list");
            found = true;
          }
        });
        if (!found) {
          var time = new Date();
          tasks.push(new Task(this.state.currentTask, false, time.toLocaleDateString()+" "+time.toLocaleTimeString()))
          this.setState({ allTasks: tasks });
          this.storeData();
          this.InputRef.current.clear();
        }
      }
      else {
        alert("Object cannot be empty");
      }
    }
  }
  _deleteTasks(tasks) {
    if (tasks.length > 0 && (tasks.filter(task => task.isChecked)).length > 0) {
      Alert.alert(
        'Delete',
        'Are you sure?',
        [
          {
            text: 'Ok', onPress: () => {
              const newTasks = tasks.filter(task => !task.isChecked);
              this.setState({ allTasks: newTasks })
              this.storeData();
            }, style: 'default'
          },
          { text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' },
        ],
        { cancelable: false },
      );
    }
  }
  render() {
    let tasks = this.state.allTasks;
    return (
      <View direction='rtl' style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Text style={styles.title}>TO-DO LIST</Text>
        <ScrollView>
          {this.state.allTasks.map((task) => {
            return (
              <View style={{ flexDirection: 'column' }} key={this.state.allTasks.indexOf(task)}>
                <View style={{ flexDirection: 'row' }}>
                  <CheckBox
                    style={{}}
                    value={task.isChecked}
                    onValueChange={() => {
                      tasks[this.state.allTasks.indexOf(task)].isChecked = !tasks[this.state.allTasks.indexOf(task)].isChecked;
                      this.setState({ allTasks: tasks });
                      this.storeData();
                    }} />
                  <Text style={this.textStyle(task.isChecked)}>{task.task}</Text>

                </View>
              </View>
            )
          })}
        </ScrollView>
        <TextInput
          style={styles.input}
          underlineColorAndroid="black"
          ref={this.InputRef}
          placeholder="To Do..."
          onChangeText={(text) => this.setState({ currentTask: text })} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableNativeFeedback
            onPress={() => this._addTask(tasks)}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
            <View>
              <Text style={styles.button}>ADD</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this._deleteTasks(tasks)}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
            <View>
              <Text style={styles.button}>DELETE</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: "black",
    fontSize: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: "lightblue",
    color: "black",
    fontSize: 25,
    margin: 10,
    justifyContent: 'center',
    borderRadius: 0
  },
  input: {
    alignSelf: 'center',
    fontSize: 20,
    alignSelf: 'stretch',
    margin: 5,

  }
});
