import { firebaseApp } from "../../firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useState } from 'react';

const ViewChat = () => {
    const [username, setUsername] = useState("");

    const [data_chats, loading, error] = useDocumentData(
        doc(getFirestore(firebaseApp), "chats", "2awCS7fkdLnIbZSYe3j3"));

    if (data_chats == undefined) {
        return(<div></div>);
    } else {
        const user = data_chats.members[0];
        const username = GetUser(user); 

        const messages = data_chats.messages.map((message) => <li class='list-group-item'><b>{username}:</b> {message.content}</li>);
        
        const styling = {
            width: 300,
        };

        return (<div class="card" style={styling}>
            <ul class='list-group list-group-flush'>
                {messages}
            </ul>
            </div>);
    }
};

const GetUser = (user) => {
    // const [data, loading, error] = useDocumentData(
    //     doc(getFirestore(firebaseApp), "users", user));

    return "tom";
};

export default ViewChat;