import { firebaseApp } from "../../firebase";
import { getFirestore, collection, Timestamp, addDoc, getDoc, doc } from "firebase/firestore"; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { useState } from "react";
import { useLocation } from 'react-router-dom';

const NewChat = () => {
    const location = useLocation();
    const db = getFirestore(firebaseApp);

    const auth = getAuth(firebaseApp);
    const [user] = useAuthState(auth);

    const [reciever, setReciever] = useState("");
    const [message, setMessage] = useState("");
    const [owner, setOwner] = useState("");

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
          offer_id: location.state.offerId,
        });

        setReciever("");
        setMessage("");
    };

    const getOffer = async (offerId) => {
      const offerRef = doc(db, "cars", offerId);
      const offerSnap = await getDoc(offerRef);
    
      return offerSnap.data();
    };

    const getOwner = async (offer) => {
      const ownerId = offer.owner_id;
      const profileRef = doc(db, "profiles", ownerId);
      const profileSnap = await getDoc(profileRef);
    
      return profileSnap.data();
    };

    getOffer(location.state.offerId)
      .then( (offer) => getOwner(offer))
      .then( (owner) => setOwner(owner));

    return (
        <form onSubmit={startConversation} className="p-4">
            <label htmlFor="reciever">To: {owner.name}</label><br/>
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