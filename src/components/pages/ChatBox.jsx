import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import ViewChat from "./ViewChat";

const Chat = ({ query }) => {
    let [p, setProps] = useState([]);

    useEffect(() => {
        async function fetchData(query) {
            const querySnapshot = await getDocs(query);
            let elements = [];

            querySnapshot.forEach((doc) => {
                elements.push([doc.id, doc.data()]);
            });

            setProps([]);
            elements.forEach((x) => {
                    let props = {
                        conversation_id: x[0],
                        offer_id: x[1].offer_id,
                        members: x[1].members,
                        messages: x[1].messages,
                    };
                    
                    setProps(p => [...p, props]);
                });
        }
        fetchData(query);
    }, [query]);

    if (Object.keys(p).length === 0) {
        return (<h3>Nan</h3>);
    } else {
        let conversations = [];
        p.forEach((propsVal) => {
            console.log(propsVal);
            conversations.push(<ViewChat {...propsVal}/>);
        } );
        return conversations;
    };
};

export default Chat;