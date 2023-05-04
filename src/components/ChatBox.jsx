import { firebaseApp } from "../firebase";
import { doc, updateDoc, getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { COLLECTIONS, PATHS, NO_PHOTO_URL } from "../consts";
import { useState } from "react";
import { labels } from "../labels";
import { sortBy } from "../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import OfferListItem from "./OfferListItem";
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from "react-router-dom";

const ChatBox = ({ chat }) => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [currentUser] = useAuthState(getAuth(firebaseApp));

  const [currentUserProfile] = useDocumentData(
    currentUser
      ? doc(getFirestore(firebaseApp), COLLECTIONS.PROFILES, currentUser.uid)
      : null
  );
  const otherMemberId = chat.members.filter(
    (memberId) => memberId !== currentUser?.uid
  )[0];
  const [otherMemberProfile] = useDocumentData(
    otherMemberId
      ? doc(getFirestore(firebaseApp), COLLECTIONS.PROFILES, otherMemberId)
      : null
  );
  const [currentChatOffer] = useDocumentData(
    chat && chat.offer_id
      ? doc(getFirestore(firebaseApp), COLLECTIONS.OFFERS, chat.offer_id)
      : null
  );

  const onOfferClick = () => {
    navigate(`/${PATHS.OFFER_DETAILS}/${chat.offer_id}`);
  };

  const sendReply = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      const formEl = e.currentTarget;
      await updateDoc(
        doc(getFirestore(firebaseApp), COLLECTIONS.CHATS, chat._id),
        {
          messages: [
            ...chat.messages,
            {
              content: formEl.replyContent.value,
              sender: getAuth(firebaseApp).currentUser.uid,
              created_at: Timestamp.now(),
            },
          ],
        }
      );
      formEl.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const sortedMessages = chat.messages.sort(sortBy("created_at"));

  const isCurrentUserSender = (msg) =>
    msg.sender === getAuth(firebaseApp).currentUser.uid;

  const getPhotoUrl = (msg) => {
    if (isCurrentUserSender(msg)) {
      return currentUserProfile?.photo_url || NO_PHOTO_URL;
    }
    return otherMemberProfile?.photo_url || NO_PHOTO_URL;
  };

  return (
    <>
      {otherMemberProfile && (
        <div className="mb-2">
          <ProfileInfo
            name={otherMemberProfile.name}
            photoUrl={otherMemberProfile.photo_url}
          />
        </div>
      )}
      {currentChatOffer && (
        <div className="mb-2">
          <OfferListItem
            offer={currentChatOffer}
            onClick={onOfferClick}
            showPhoto={false}
          />
        </div>
      )}
      <hr />
      <div className="list-group">
        {sortedMessages.map((msg) => (
          <li
            key={msg.created_at}
            className={`list-group-item d-flex align-items-center ${
              isCurrentUserSender(msg) ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <img
              src={getPhotoUrl(msg)}
              className={`border rounded ${
                isCurrentUserSender(msg) ? "me-2" : "ms-2"
              }`}
              height={40}
            />
            <div>{msg.content}</div>
          </li>
        ))}
        {sortedMessages.length === 0 && <div>{labels.NO_MESSAGES_HINT}</div>}
      </div>

      <form className="d-flex mt-3" onSubmit={sendReply}>
        <input
          className="form-control"
          name="replyContent"
          placeholder={labels.NEW_MESSAGE_PLACEHOLDER}
          disabled={saving}
          required
        ></input>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary ms-2"
        >
          {labels.SEND}
        </button>
      </form>
    </>
  );
};

export default ChatBox;
