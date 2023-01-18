import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAuSY7S27XQNXn9VDKmrZFJ9uOKXhnxDg",
  authDomain: "chat-app-525a4.firebaseapp.com",
  projectId: "chat-app-525a4",
  storageBucket: "chat-app-525a4.appspot.com",
  messagingSenderId: "684342955443",
  appId: "1:684342955443:web:9eafe8dac13053cfa8cfc6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
