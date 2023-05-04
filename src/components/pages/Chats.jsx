import { firebaseApp } from "../../firebase";
import { getFirestore, collection, query, where } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Chat from './ChatBox';

const Chats = () => {
    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);

    let q = undefined;

    if (user) {
        console.log(user.uid);
    }

    let uid = user.uid;
    let db = getFirestore(firebaseApp);

    const chats = collection(db, 'chats');
    if (chats) {
        let q = query(chats, where("members", "array-contains", uid));

        return (<Chat query={q}/>);
    } else {
        return <InvalidPage />;
    }
};

export default Chats;