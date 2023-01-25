import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function ChatSendMessage({ newUser }) {
  const [messageInput, setMessageInput] = useState("");
  const [user] = useAuthState(auth);

  const chatRef = doc(db, "chatList", newUser.email);

  const sendMessage = () => {
    const addMessage = async () => {
      const updateDoc = collection(chatRef, "messages");
      await addDoc(updateDoc, {
        messages: messageInput,
        userLoggedIn: user.email,
        newUser: newUser.email,
        photoURL: user.photoURL,
        id: user.uid,
        timestamp: serverTimestamp(),
      });
    };

    addMessage();

    setMessageInput("");

    const updateUserTimestamp = async () => {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        timestamp: serverTimestamp(),
      });
    };

    updateUserTimestamp();
  };

  return (
    <main className="w-screen px-6 ">
      <section className="w-full py-5">
        <input
          className="relative w-full p-3 outline-none border-2 border-[#75e8e7] rounded-2xl bg-gray-900 text-white text-md"
          type="text"
          placeholder="Enter your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          className="absolute z-20 top-8 right-8"
          type="submit"
          disabled={!messageInput}
          onClick={sendMessage}
        >
          <SendIcon sx={{ width: 30, height: 30, color: "#75e8e7" }} />
        </button>
      </section>
    </main>
  );
}

export default ChatSendMessage;
