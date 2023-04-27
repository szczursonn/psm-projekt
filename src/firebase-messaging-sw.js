importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCiuHm8rMciVlj0A1rjquD2hFAPJAg8FUA",
    authDomain: "psm-firebase-4f74c.firebaseapp.com",
    databaseURL: "https://psm-firebase-4f74c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "psm-firebase-4f74c",
    storageBucket: "psm-firebase-4f74c.appspot.com",
    messagingSenderId: "317824968239",
    appId: "1:317824968239:web:875d9971ab5ed6dfbc08da"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });