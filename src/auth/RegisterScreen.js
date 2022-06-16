import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
// import { getAuth } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

// const auth = getAuth();

export default function RegisterScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    
    function onSignUp(){
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                setDoc(doc(database, "users", auth.currentUser.uid), {
                    name: name,
                    email: email,
                   
                  });
                
                // console.log(result)
             })
            .catch((error) => console.log(error))
    }
    return (
        <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
            <TextInput 
                placeholder='name'
                onChangeText={(name) => setName(name)}
            />
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
                title='Sign Up'
                onPress={() => onSignUp()}
            />
        </View>
    )
}
