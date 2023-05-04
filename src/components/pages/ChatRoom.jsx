import { firebaseApp } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Chats from './Chats';
import SignInPage from "./SignInPage";


const ChatRoom = () => {
    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);

    if (user) {
        return <Chats />;
    } else {
        return <SignInPage />;
    }
};

export default ChatRoom;