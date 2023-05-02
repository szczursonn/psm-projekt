import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import ViewChat from "./Chatting";

const Chat = ({ query }) => {
    let [p, setProps] = useState({});

    useEffect(() => {
        async function fetchData(query) {
            const querySnapshot = await getDocs(query);
            let elements = [];

            querySnapshot.forEach((doc) => {
                elements.push(doc.data());
            });


            elements.forEach((x) => {
                    let props = {
                        offer_id: x.offer_id,
                        members: x.members,
                        messages: x.messages,
                    };

                    setProps(props);
                });
        }
        fetchData(query);
    }, [query]);    

    if (Object.keys(p).length === 0) {
        return (<h3>Nan</h3>);
    } else {
        return <ViewChat {...p}/>;
    };
};

export default Chat;