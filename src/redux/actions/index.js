import { auth, database } from '../../config/firebase'
import { doc, getDoc, query, orderBy, collection,onSnapshot } from "firebase/firestore";

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index';
// import { SnapshotViewIOSComponent } from 'react-native'

export function fetchUser() {
    return ((dispatch) => {
        const docRef = doc(database, "users", auth.currentUser.uid);
        const docSnap = getDoc(docRef);

        docSnap.then((snapshot) => {
            if (snapshot.exists) {
                dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
            } else {
                console.log('user does not exists');
            }
        }).catch((error) => { console.log(error) })

    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        const postRef = doc(database, "posts", auth.currentUser.uid)
        const imageRef = collection(postRef, "userPosts");
        const imageQuery = query(imageRef, orderBy("creation", "asc"));
        const imageSnap = getDoc(imageQuery)

        imageSnap.then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
        })

    })
}


export function fetchUserFollowing() {
    return ((dispatch) => {

        const followRef = doc(database, "following", auth.currentUser.uid)
        const userFollowingRef = collection(followRef, "userFollowing");
    

        onSnapshot(userFollowingRef).then((snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id
            })
            dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
            for (let i = 0; i < following.length; i++) {
                dispatch(fetchUsersData(following[i]));
            }
        })
    })
}



export function fetchUsersData(uid) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {

        const docRef = doc(database, "users", uid);
        const docSnap = getDoc(docRef);

        docSnap.then((snapshot) => {
            if (snapshot.exists) {
                let user = snapshot.data();
                user.uid = snapshot.id;

                dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                dispatch(fetchUsersFollowingPosts(user.uid));
            }
            else {
                console.log('does not exist')
            }
        }).catch((error) => { console.log(error) })
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {

        const postRef = doc(database, "posts", uid)
        const imageRef = collection(postRef, "userPosts");
        const imageQuery = query(imageRef, orderBy("creation", "asc"));
        const imageSnap = getDoc(imageQuery)

        imageSnap.then((snapshot) => {
            const uid = snapshot.query.EP.path.segments[1];
            const user = getState().usersState.users.find(el => el.uid === uid);
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data, user }
            })
            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })

        })
    })
}


export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}