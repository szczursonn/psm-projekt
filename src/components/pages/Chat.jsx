import { firebaseApp } from "../../firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

const ViewChat = () => {  
    const [data, loading, error] = useDocumentData(
      doc(getFirestore(firebaseApp), "chats", "rgtDBkgeISYUrolySxv2"));
        
    if(data == undefined) {
        return <div></div>;
    }
    else {
        const messages = data.messages.map((message) => <li>{message}</li>);

        return (<div>
            {data.user_id}
            {data.second_user_id}
            <ul>
                {messages}
            </ul>
            </div>);
    }
};

export default ViewChat;