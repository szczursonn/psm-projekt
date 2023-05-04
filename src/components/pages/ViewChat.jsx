import { firebaseApp } from "../../firebase";
import { doc, updateDoc, getFirestore, collection, Timestamp } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { PATHS } from "../../consts";
import {Link} from "react-router-dom";

const ViewChat = ({conversation_id, offer_id, members, messages}) => {
    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);
    const [userSnapshot, _l, _e] = useCollection(
        collection(getFirestore(firebaseApp), "profiles"));
    const [formValue, setFormValue] = useState('');
    const [open, setOpen] = useState(false);

    const db = getFirestore(firebaseApp);
    const chatRef = doc(db, "chats", conversation_id);

    const sendReply = async (e) => {
        e.preventDefault();
        await updateDoc(chatRef, {messages: [...messages, {
            content: formValue,
            sender: user.uid,
            created_at: Timestamp.now(),
        }]})
        setFormValue('');
    };

    let msg = "";
    let memberOne = members[0];
    let memberTwo = members[1];

    if (userSnapshot == undefined) {
        msg = messages.map((message) => <li class='list-group-item'>
        {message.content}
        </li>);
    } else {
        msg = messages.map((message) => <li class='list-group-item'>
        {userSnapshot.docs.filter((elem) => elem.id == message.sender).map((elem) => <b>{elem.data().name}: </b>)}
        {message.content}
        </li>);

        memberOne = userSnapshot.docs.filter((elem) => elem.id == memberOne).map((elem) => elem.data().name);
        memberTwo = userSnapshot.docs.filter((elem) => elem.id == memberTwo).map((elem) => elem.data().name);
    }
    
    const styling = {
        width: 300,
    };

    const toggle = () => {
        setOpen(!open);
    };

    return (<div className="m-4">
        <button onClick={toggle} type="button" class="btn btn-outline-primary">
            Conversation between {memberOne} and {memberTwo}</button>
        {open && <div className="conversation">
            <div className="card" style={styling}>
                {memberOne}<br/>
                {memberTwo}<br/>
                <Link to={`/${PATHS.OFFER_DETAILS}/${offer_id}`}>Go to offer</Link><br/>
                <ul class='list-group list-group-flush'>
                    {msg}
                </ul>
            </div>

            <div>
                <form onSubmit={sendReply}>
                    <label htmlFor="repl">Reply:</label><br/>
                    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}
                    className="form-control" id="repl" name="repl" style={styling}></input><br/>

                    <button type="submit" value="Reply" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>}
        </div>
        );
};

export default ViewChat;