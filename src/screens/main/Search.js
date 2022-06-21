import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import { database } from '../../config/firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        const userRef = collection(database,"users")
        const userQuery = query(userRef, where('name', '==', search))
        const userSnapshot = getDocs(userQuery);
        userSnapshot.then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            });
            setUsers(users);
        })
    }
    return (
        <View>
            <TextInput
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)}
                 />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>

                )}
            />
        </View>
    )
}