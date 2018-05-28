import React, { Component } from "react";
import { createStackNavigator } from 'react-navigation';

import {
  StyleSheet,
  Text,
  Alert,
  View,
  Button,
  FlatList,
  AsyncStorage,
  Keyboard,
  TextInput,
  Platform,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

class Home extends Component{
  render() {
    return (
      <View style={{ border:1, margin: 4, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ paddingBottom:15, fontSize: 22, fontWeight: 'bold' }}>Welcome to To-Do App</Text>
        <Button
          title=" Go to Tasks Entry "
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class Details extends Component{
  state = {
    tasks: [],
    text: "",
    textValue: "Mark",
    count: 0,
    curDay: new Date()
  };
  
 
  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState({
        count : this.state.count + 1,
        curDay: (this.state.curDay).toString()
      })
      this.setState(
        prevState => {
          let { tasks, text, textValue } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }),
            text: "",
            
          };
          
        },
        () => Tasks.save(this.state.tasks)
      );
    }
  };
  

  remTask = e => {
    this.setState({
      count: this.state.count - 1
    })
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(e, 1);

        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
   
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding}]}
      >
      <View style={{width:"100%", height: 40, backgroundColor: 'white', color:'black'}}>
      <Text style={{paddingTop:2, paddingLeft: 8, fontSize: 20, justifyContent:'center', textAlign:'center'}}>Tasks ToDo</Text>
      </View>
      <View style={{paddingBottom:5}}><Text>Total = {this.state.tasks.length}</Text></View>
      
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View>
              
              <View style={styles.listItemCont}>
                <TouchableOpacity>
                  <Text style={styles.listItem} >
                    {item.text}{"\n"}{((this.state.curDay).toString()).substr(4,11)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                style={styles.touchStyleMark}
                onPress={()=>{Alert.alert(
                      item.text+' : Marked done',
                      'Press OK to remove task!',
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'Ok', onPress: () => this.remTask(index)},
                      ],
                      { cancelable: false }
                    )}}>
                  <Text>Mark</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                 style={styles.touchStyleX}
                 onPress={() => this.remTask(index)} >
                 <Text style={{color: 'white', fontWeight: 'bold'}}>X</Text>
               </TouchableOpacity>
              </View>
              
              <View style={styles.hr} />
              
            </View>}
            
        />
        <Text>Enter Task</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Tasks"
          returnKeyType="Add"
          returnKeyLabel="Add"
        />
        
      </View>
    );
  }

}

const RootStack = createStackNavigator(
  {
    Home: Home,
    Details: Details,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends Component {
   render() {
    return <RootStack />;
  }
}  

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth:2, 
    borderColor:'black',
    paddingTop: 15
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 5,
    fontSize: 18,
  },
  hr: {
    height: 1,
    paddingTop: 2,
    backgroundColor: "black",
    marginBottom:5
  },
  
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
  },
  textInput: {
    height: 40,
    marginTop: 10,
    marginBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    width: "100%"
  },
  touchStyleMark: {
     alignItems:'center',
     justifyContent:'center',
     width:45,
     height:27,
     backgroundColor:'#818284',
  },
  touchStyleX: {
     marginRight:4,
     borderWidth:0,
     alignItems:'center',
     justifyContent:'center',
     width:25,
     height:25,
     backgroundColor:'#ef2f09',
     borderRadius:100,
  }
  
});

