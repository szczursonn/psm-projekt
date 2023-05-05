import { firebaseApp } from "../../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { COLLECTIONS } from "../../consts";
import { labels } from "../../labels";
import FullPageLoadingSpinner from "../FullPageLoadingSpinner";
import { useSearchParams } from "react-router-dom";
import ChatBox from "../ChatBox";

const CHAT_PARAMETER = "chat";

const ChatPage = () => {
  const [currentUser, userLoading, userError] = useAuthState(
    getAuth(firebaseApp)
  );
  const [snapshots, chatsLoading, chatsError] = useCollection(
    currentUser
      ? query(
          collection(getFirestore(firebaseApp), COLLECTIONS.CHATS),
          where("members", "array-contains", currentUser?.uid)
        )
      : null
  );
  const chats = snapshots?.docs.map((snapshot) => ({
    ...snapshot.data(),
    _id: snapshot.id,
  }));

  const [searchParams, setSearchParams] = useSearchParams();

  const currentChatId = searchParams.get(CHAT_PARAMETER) || "";
  const currentChat = chats?.find((chat) => chat._id === currentChatId);
  const setCurrentChatId = (id) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (id) {
      newSearchParams.set(CHAT_PARAMETER, id);
    } else {
      newSearchParams.delete(CHAT_PARAMETER);
    }
    setSearchParams(newSearchParams);
  };

  const loading = userLoading || chatsLoading;
  const error = userError || chatsError;

  return (
    <div className="container-fluid">
      {loading && <FullPageLoadingSpinner />}
      {error && (
        <div className="alert alert-danger" role="alert">
          {labels.THERE_WAS_AN_UNEXPECTED_ERROR}: {error.message}
        </div>
      )}
      {!loading && !currentUser && <h3>{labels.LOG_IN_TO_ACCESS}</h3>}
      {chats && (
        <>
          <select
            className="form-select mt-2 mb-2"
            value={currentChatId}
            onChange={(e) => setCurrentChatId(e.currentTarget.value)}
          >
            <option value={""}>{labels.SELECT_CHAT}</option>
            {chats.map((chat) => (
              <option value={chat._id} key={chat._id}>
                {chat._id}
              </option>
            ))}
          </select>
          <hr />
          {currentChat && currentUser && <ChatBox chat={currentChat} />}
        </>
      )}
    </div>
  );
};

export default ChatPage;
