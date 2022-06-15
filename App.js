import React, { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

// import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
// import { getFirestore } from 'firebase/firestore';
// import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/auth/LandingScreen';
import RegisterScreen from './src/auth/RegisterScreen';
import LoginScreen from './src/auth/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';


// const firebaseConfig = {
//   apiKey: Constants.manifest.extra.apiKey,
//   authDomain: Constants.manifest.extra.authDomain,
//   projectId: Constants.manifest.extra.projectId,
//   storageBucket: Constants.manifest.extra.storageBucket,
//   messagingSenderId: Constants.manifest.extra.messagingSenderId,
//   appId: Constants.manifest.extra.appId,
//   databaseURL: Constants.manifest.extra.databaseURL
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const database = getFirestore(app);

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Landing' component={LandingScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};


function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
export default function App() {

  // const [isLoaded, setIsLoaded] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState()
  // useEffect(() => {
  //   onAuthStateChanged((user) => {
  //     if(!user){
  //       setIsLoggedIn(false),
  //       setIsLoaded(true)
  //     }else{
  //       setIsLoggedIn(true),
  //       setIsLoaded(true)
  //     }
  //   })
  // },[])
  // if(!isLoaded){
  //   return(
  //     <View>
  //       <Text>Loading</Text>
  //     </View>
  //   )
  // }
  // return (

  //   <NavigationContainer>
  //     <Stack.Navigator initialRouteName='Landing'>
  //       <Stack.Screen name='Landing' component={LandingScreen} options={{ headerShown: false}}/>
  //       <Stack.Screen name='Register' component={RegisterScreen}/>
  //       <Stack.Screen name='Login' component={LoginScreen}/>
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
