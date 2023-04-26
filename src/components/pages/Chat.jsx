import { firebaseApp } from "../../firebase";
import { doc, getFirestore, collection } from "firebase/firestore";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";

const ViewChat = () => {
    const [data_chats, loading, error] = useDocumentData(
        doc(getFirestore(firebaseApp), "chats", "2awCS7fkdLnIbZSYe3j3"));

    const [snapshot, _l, _e] = useCollection(
            collection(getFirestore(firebaseApp), "users"));

    if (data_chats == undefined) {
        return(<div></div>);
    } else {
        const messages = data_chats.messages.map((message) => <li class='list-group-item'>
            <b>{snapshot.docs.filter((elem) => elem.id == message.sender).map((elem) => <div>{elem.data().name}</div>)}:</b>
            {message.content}
            </li>);
        
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

export default ViewChat;