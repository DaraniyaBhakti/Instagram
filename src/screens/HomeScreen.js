import React from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
const HomeScreen = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>signOut(auth).catch(error => console.log(error.message))}>
      <Text>HomeScreen</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen
