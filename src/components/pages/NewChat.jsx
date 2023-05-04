import { firebaseApp } from "../../firebase";
import { getFirestore, collection, Timestamp, addDoc } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { useState } from "react";

const NewChat = () => {
    const db = getFirestore(firebaseApp);

    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);

    const [reciever, setReciever] = useState("");
    const [message, setMessage] = useState("");

    const startConversation = async (e) => {
        e.preventDefault();
        
        await addDoc(collection(db, "chats"), {
          members: [user.uid, reciever],
          messages: [
            {
              content: message,
              created_at: Timestamp.now(),
              sender: user.uid,
            }
          ],
          offer_id: ""
        });

        setReciever("");
        setMessage("");
    };

    return (
        <form onSubmit={startConversation} className="p-4">
            <label htmlFor="reciever">To:</label><br/>
            <input value={reciever} onChange={(e) => setReciever(e.target.value)}
              className="form-control" type="text" id="reciever" name="reciever"/><br/>
            <label htmlFor="msg">Message:</label><br/>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              className="form-control" id="msg" name="msg" rows="3"></textarea><br/>

            <button type="submit" value="Submit" className="btn btn-primary mt-1">Submit</button>
        </form>
    );
};

export default NewChat;