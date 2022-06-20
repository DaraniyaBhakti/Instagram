import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import { auth, database, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, doc } from "firebase/firestore";

export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                resolve(xhr.response);
            }
            xhr.onerror = function () {
                reject(new Error('uriTOBlob failed'));
            }
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        })
    }
    const uploadImage = async () => {

        const uri = props.route.params.image;
        const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)


        const response = await fetch(uri);
        // console.log("response",JSON.stringify(response))
        const blob = await response.blob();
        // console.log("blob",JSON.stringify(blob))


        const storageRef = ref(storage, childPath);

        // console.log("storage",JSON.stringify(storageRef))


        // Upload the file and metadata
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // console.log(uploadTask.json());
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                // console.log(snapshot);
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
                // Handle unsuccessful uploads
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
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
                        console.log("Unknown error occurred, inspect error.serverResponse")
                        break;
                    default:
                        { console.log("Error") }
                }
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    savePostData(downloadURL)
                });
            }
        );
    }

    const savePostData = (downloadURL) => {
        const postRef = doc(database, "posts", auth.currentUser.uid)
        const imageRef = collection(postRef, "userPosts",`${auth.currentUser.uid}/${Math.random().toString(36)}`);
        // console.log(postRef)
        addDoc(imageRef, {
            downloadURL,
            caption,
            creation: database.FieldValue.serverTimestamp()
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