import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native'
import { doc,setDoc, deleteDoc } from "firebase/firestore";
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    // console.log("feeds", props)
    useEffect(() => {
        let posts = [];
        if(props.usersFollowingLoaded == props.following.length){
            for(let i = 0; i < props.following.length; i++){
                const user = props.users.find(el => el.uid === props.following[i]);
                if(user != undefined){
                    posts = [...posts, ...user.posts];
                }
            }
            posts.sort(function(x, y){
                return x.creation - y.creation;
            })
            setPosts(posts);

        }

    }, [props.usersFollowingLoaded])
    // const onLikePress =(uid,postId) =>{
    //     const postRef = doc(database, "posts", uid)
    //     const imageRef = doc(postRef, "userPosts",postId);
    //     const likeRef = doc(imageRef,'likes',auth.currentUser.uid)
    //     setDoc(likeRef, {})
       
    // }
    // const onDislikePress = (uid,postId) => {
    //     const postRef = doc(database, "posts", uid)
    //     const imageRef = doc(postRef, "userPosts",postId);
    //     const likeRef = doc(imageRef,'likes',auth.currentUser.uid)
    //     deleteDoc(likeRef)
    // }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            {/* {item.currentUserLike ?
                                <Button title='Dislike'
                                onPress={() => onDislikePress(item.user.uid,item.id)}/>
                                :
                                <Button title='Like'
                                onPress={() => onLikePress(item.user.uid,item.id)}/>
                            } */}
                            <Button title='View Comments' 
                            onPress={() => 
                                [
                                props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })
                            ,console.log("btn click")]
                        } 
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    // feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded


})
export default connect(mapStateToProps, null)(Feed);
