import React, { useState } from 'react'
import { View, Button, TextInput ,Text,TouchableOpacity} from 'react-native'

import { auth } from '../config/firebase';
import { container, form } from '../styles';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    function onLogin(){
        signInWithEmailAndPassword(auth, email, password)
    }
    return (
        <View style={container.center}>
        <View style={container.formCenter}>
            <TextInput
                style={form.textInput}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                style={form.textInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />

            <Button
                style={form.button}
                onPress={() => onLogin()}
                title="Sign In"
            />
        </View>


        <View style={form.bottomButton} >
            <TouchableOpacity
                onPress={() => props.navigation.navigate("Register")} >
                    <Text>
                Don't have an account? SignUp.
            </Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}
