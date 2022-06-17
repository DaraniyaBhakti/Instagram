import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import { auth, database, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc } from "firebase/firestore";

export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        // console.log(childPath)

        const response = await fetch(uri);
        console.log(response)
        const blob = await response.blob();

        const imagesRef = ref(storage, childPath);

        const uploadTask = uploadBytes(imagesRef, blob);
        console.log("upoad task = "+uploadTask.task)
        const taskProgress = snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        }

        const taskError = snapshot => {
            console.log("Error : "+snapshot)
        }

        const taskCompleted = () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                savePostData(downloadURL);
            });
        }

        uploadTask.on('state_changed', taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        const imageRef = doc(database, "posts", auth.currentUser.uid, "userPosts");
        addDoc(imageRef, {
            downloadURL,
            caption,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function () {
            props.navigation.popToTop();
        }))
        .catch(error => console.log(error));

    }
    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
            />

            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}