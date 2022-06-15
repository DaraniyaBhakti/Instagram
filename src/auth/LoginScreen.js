import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
// import { getAuth } from 'firebase/auth';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// const auth = getAuth();
export default function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    function onLogin(){
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {console.log(result) })
            .catch((error) => console.log(error))
    }
    return (
        <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
            <TextInput 
                placeholder='email'
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput 
                placeholder='password'
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />

            <Button 
                title='Login'
                onPress={() => onLogin()}
            />
        </View>
    )
}
