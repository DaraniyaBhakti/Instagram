import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './src/redux/reducers';
import thunk from 'redux-thunk';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/auth/LandingScreen';
import RegisterScreen from './src/auth/RegisterScreen';
import LoginScreen from './src/auth/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import Add from './src/screens/main/Add';


const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createNativeStackNavigator();



export class App extends Component {
  constructor(props) {
    super(props)
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
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (!user) {
    //     this.setState({
    //       loggedIn: false,
    //       loaded: true,
    //     })
    //   } else {
    //     this.setState({
    //       loggedIn: true,
    //       loaded: true,
    //     })
    //   }
    // })
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
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        {/* <MainScreen /> */}
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen}  options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={Add} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
// export default function App() {

//   const [isLoaded, setIsLoaded] = useState(false)

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         setIsLoggedIn(false),
//           setIsLoaded(true)
//       } else {
//         setIsLoggedIn(true),
//           setIsLoaded(true)
//       }
//     })
//   })

//   const [isLoggedIn, setIsLoggedIn] = useState()
//   if (!isLoaded) {
//     return (
//       <View>
//         <Text>Loading</Text>
//       </View>
//     )
//   }
//   if (!isLoggedIn) {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName='Landing'>
//           <Stack.Screen name='Landing' component={LandingScreen} options={{ headerShown: false }} />
//           <Stack.Screen name='Register' component={RegisterScreen} />
//           <Stack.Screen name='Login' component={LoginScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
//   return (
//     <Provider store={store}>
//       <MainScreen />
//     </Provider>
//   )
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
