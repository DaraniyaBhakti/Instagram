import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Reducers from './src/redux/reducers';
import thunk from 'redux-thunk';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from './src/auth/RegisterScreen';
import LoginScreen from './src/auth/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import Add from './src/screens/main/Add';
import Save from './src/screens/main/Save';
import Comments from './src/screens/main/Comments';


const store = createStore(Reducers, applyMiddleware(thunk));
const Stack = createNativeStackNavigator();



export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
            this.setState({
              loggedIn: false,
              loaded: true,
            })
          } else {
            this.setState({
              loggedIn: true,
              loaded: true,
            })
          }
          })
    
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
           
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main" >
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={Add} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={Save} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={Comments} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
