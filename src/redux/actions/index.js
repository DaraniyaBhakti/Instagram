import { auth, database } from '../../config/firebase'
import { doc, getDoc } from "firebase/firestore";
import { USER_STATE_CHANGE } from '../constants/index';

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
        }).catch((error) => {console.log(error)})
        
    })
}

