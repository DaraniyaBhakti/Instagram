import React, { useState } from 'react'
import { View, Button, TextInput , Text,TouchableOpacity} from 'react-native'
import { Snackbar } from 'react-native-paper';
import { container, form } from '../styles';
import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc,collection, where,query, getDoc } from "firebase/firestore"; 

export default function RegisterScreen(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('');
    const [isValid, setIsValid] = useState(true);

    const onRegister = () => {
        if (name.length == 0 || username.length == 0 || email.length == 0 || password.length == 0) {
            setIsValid({ bool: true, boolSnack: true, message: "Please fill out everything" })
            return;
        }
        if (password.length < 6) {
            setIsValid({ bool: true, boolSnack: true, message: "passwords must be at least 6 characters" })
            return;
        }
        if (password.length < 6) {
            setIsValid({ bool: true, boolSnack: true, message: "passwords must be at least 6 characters" })
            return;
        }

        const userRef = collection(database,"users")
        const userQuery = query(userRef, where('username', '==', username))
        const userSnap = getDoc(userQuery)
        userSnap.then((snapshot) =>{
            if (!snapshot.exist) {
                createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                if (snapshot.exist) {
                    return
                }
                setDoc(doc(database, "users", auth.currentUser.uid), {
                    name,
                    email,
                    username,
                    image:'default',
                    followingCount: 0,
                    followersCount: 0,
                  });
             })
             .catch(() => {
                setIsValid({ bool: true, boolSnack: true, message: "Something went wrong" })
            })
            }  
        }).catch(() => {
            setIsValid({ bool: true, boolSnack: true, message: "Something went wrong" })
        })
    }

 
    return (
        <View style={container.center}>
        <View style={container.formCenter}>
            <TextInput
                style={form.textInput}
                placeholder="Username"
                value={username}
                keyboardType="twitter"
                onChangeText={(username) => setUsername(username.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/gi, ''))}
            />
            <TextInput
                style={form.textInput}
                placeholder="Name"
                onChangeText={(name) => setName(name)}
            />
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
                onPress={() => onRegister()}
                title="Register"
            />
        </View>

        <View style={form.bottomButton} >
        <TouchableOpacity
                onPress={() => props.navigation.navigate("Login")} >
                    <Text>
                    Already have an account? SignIn.
            </Text>
            </TouchableOpacity>
            
        </View>
        <Snackbar
            visible={isValid.boolSnack}
            duration={2000}
            onDismiss={() => { setIsValid({ boolSnack: false }) }}>
            {isValid.message}
        </Snackbar>
    </View>    )
}
