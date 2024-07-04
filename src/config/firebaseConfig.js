import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfNIBHhCLr4KjhQ0uD2JsITtIXFMAjoNQ",
  authDomain: "exhibitions-86a45.firebaseapp.com",
  projectId: "exhibitions-86a45",
  storageBucket: "exhibitions-86a45.appspot.com",
  messagingSenderId: "749263096915",
  appId: "1:749263096915:web:f16053f3c1d03fb2a54aa6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };