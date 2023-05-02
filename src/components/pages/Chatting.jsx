import { firebaseApp } from "../../firebase";
import { doc, getFirestore, collection } from "firebase/firestore";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";

const ViewChat = ({offer_id, members, messages}) => {

    console.log("OFFER ID ", offer_id);
    console.log("MEMBERS ", members);
    console.log("MESSAGES", messages);

    const mg = messages.map((message) => <li class='list-group-item'>{message.content}</li>);
    
    const styling = {
        width: 300,
    };

    return (<div class="card" style={styling}>
        {offer_id}
        {members}
        <ul class='list-group list-group-flush'>
            {mg}
        </ul>
        </div>);
};

export default ViewChat;