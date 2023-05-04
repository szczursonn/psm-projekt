import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCiuHm8rMciVlj0A1rjquD2hFAPJAg8FUA",
  authDomain: "psm-firebase-4f74c.firebaseapp.com",
  databaseURL: "https://psm-firebase-4f74c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "psm-firebase-4f74c",
  storageBucket: "psm-firebase-4f74c.appspot.com",
  messagingSenderId: "317824968239",
  appId: "1:317824968239:web:875d9971ab5ed6dfbc08da"
};

export const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

getToken(messaging, {
  vapidKey:
    "BPgxFlyTbZkxBzFYIpegWG9yeyXvY_5exX9CZsQva19tN6LnrHA33n-il6DGLBgh7vxhFU-UtTrwJVUyGlFImcY",
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("Firebase Token", currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });

onMessage(messaging, (payload) => {
    console.log(payload);
  });
