import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'
import { auth, database } from '../../config/firebase'
import { doc, addDoc, collection, getDocs } from 'firebase/firestore';

function Comments(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {

        function matchUserToComment(comments) {
            for(let i = 0; i < comments.length; i++) {

                if(comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }


        if(props.route.params.postId !== postId) {
            const postRef = doc(database, 'posts', props.route.params.uid);
            const userPostRef = doc(postRef, 'userPosts', props.route.params.postId)
            const commentRef = collection(userPostRef, 'comments')
            const commentSnap = getDocs(commentRef);

            commentSnap.then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                matchUserToComment(comments)
            })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {

        const postRef = doc(database, 'posts', props.route.params.uid);
        const userPostRef = doc(postRef, 'userPosts', props.route.params.postId)
        const commentRef = collection(userPostRef, 'comments')
       
        addDoc(commentRef,{
            creator: auth.currentUser.uid,
            text
        })
        console.log("comment")
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <Text>
                                {item.user.name}
                            </Text>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <View>
                <TextInput 
                placeholder='comment'
                onChangeText={(text) => setText(text)}/>
                <Button
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>

        </View>
    )
}


const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comments);

