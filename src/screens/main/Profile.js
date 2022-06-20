import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import { auth, database } from '../../config/firebase';
import { doc, getDoc, query, orderBy, collection, setDoc ,deleteDoc} from "firebase/firestore";

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props;

        if (props.route.params.uid === auth.currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        else {

            const docRef = doc(database, "users", props.route.params.uid);
            const docSnap = getDoc(docRef);

            docSnap.then((snapshot) => {
                if (snapshot.exists) {
                    setUser(snapshot.data)
                } else {
                    console.log('user does not exists');
                }
            }).catch((error) => { console.log(error) })

            const postRef = doc(database, "posts", props.route.params.uid)
            const imageRef = collection(postRef, "userPosts");
            const imageQuery = query(imageRef, orderBy("creation", "asc"));
            const imageSnap = getDoc(imageQuery)

            imageSnap.then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts)
            })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {

        const followingRef = doc(database, 'following', auth.currentUser.uid);
        const userFollowingRef = doc(followingRef, "userFollowing", props.route.params.uid);

        setDoc(userFollowingRef,{})
    }
    const onUnfollow = () => {

        const followingRef = doc(database, 'following', auth.currentUser.uid);
        const userFollowingRef = doc(followingRef, "userFollowing", props.route.params.uid);

        deleteDoc(userFollowingRef);
    }

    const onLogout = () => {
        auth.signOut();
    }

    if (user === null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>Profile</Text>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {props.route.params.uid !== auth.currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                    </View>
               ) :
               <Button
                   title="Logout"
                   onPress={() => onLogout()}
               />}
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
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
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);
