import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import { auth, database, storage } from '../../config/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {

        const uri = props.route.params.image;
        const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, childPath);

        // Upload the file and metadata
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
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
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        console.log("User doesn't have permission to access the object")
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        console.log("User canceled the upload")
                        break;
                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        console.log("Unknown error occurred, inspect error.serverResponse"+error)
                        break;
                    default:
                        { console.log("Error") }
                }
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    savePostData(downloadURL)
                });
            }
        );
    }

    const savePostData = (downloadURL) => {
        const postRef = doc(database, "posts", auth.currentUser.uid)
        const imageRef = collection(postRef, "userPosts");
        
        addDoc(imageRef, {
            downloadURL,
            caption,
            creation: serverTimestamp()
        }).then((function () {
            props.navigation.popToTop();
        }))
        .catch(error => console.log("Save post data error   "+error));

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