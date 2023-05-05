import { useEffect, useState } from "react";
import {
  query,
  collection,
  getFirestore,
  onSnapshot,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../firebase";
import { COLLECTIONS } from "../consts";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const UNREAD_AMOUNT_KEY = "psm-projekt-unread-amount";

export const useChatNotifications = () => {
  const [user] = useAuthState(getAuth(firebaseApp));
  const [unreadMessagesAmount, setUnreadMessagesAmount] = useState(
    parseInt(window.localStorage.getItem(UNREAD_AMOUNT_KEY)) || 0
  );
  const [unsubscribeCb, setUnsubscribeCb] = useState(null);

  useEffect(() => {
    if (user) {
      const cb = onSnapshot(
        query(
          collection(getFirestore(firebaseApp), COLLECTIONS.CHATS),
          where("members", "array-contains", user.uid)
        ),
        (snapshot) => {
          const updatedChats = snapshot
            .docChanges()
            .filter(({ type }) => type === "modified");
          if (updatedChats.length !== 1) {
            return;
          }
          setUnreadMessagesAmount((amount) => amount + 1);
        }
      );
      setUnsubscribeCb((_) => cb);
    }

    return unsubscribeCb || (() => {});
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(
      UNREAD_AMOUNT_KEY,
      unreadMessagesAmount.toString()
    );
  }, [unreadMessagesAmount]);

  return [unreadMessagesAmount, () => setUnreadMessagesAmount(0)];
};
