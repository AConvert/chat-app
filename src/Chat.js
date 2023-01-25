import React, { useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatHeader from "./components/ChatHeader";
import SendIcon from "@mui/icons-material/Send";
import Picker from "emoji-picker-react";

import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import MessageToDisplay from "./components/MessageToDisplay";
import { useAuthState } from "react-firebase-hooks/auth";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

function Chat() {
  const { state } = useLocation();
  const { newUser, authenticatedUser } = state;
  const endOfMessagesRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [user] = useAuthState(auth);
  const [messagesSnapshot] = useCollection(
    query(collectionGroup(db, "messages"), orderBy("timestamp", "asc"))
  );

  const sendMessage = () => {
    const fetchChatRef = async () => {
      const chatRef = doc(db, "chatList", newUser.email);

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

    fetchChatRef();

    setMessageInput("");
  };

  // const ScrollToBottom = () => {
  //   endOfMessagesRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => {
        if (
          (message.data().id === authenticatedUser.id &&
            message.data().newUser === newUser.email) ||
          (message.data().userLoggedIn === newUser.email &&
            message.data().newUser === authenticatedUser.email)
        ) {
          return (
            <MessageToDisplay
              key={message.id}
              users={message.data().user}
              id={message.id}
              message={message.data()}
              timestamp={new Date(message.data().timestamp * 1000)}
            />
          );
        }
      });
    }

    // ScrollToBottom();
  };

  return (
    <main className="relative overflow-y-scroll h-screen w-screen bg-gray-900">
      <div className="absolute z-20 top-0 left-0 p-2">
        <Link to={"/"} className="text-white">
          <ChevronLeftIcon sx={{ width: 36, height: 36 }} />
        </Link>
        <Outlet />
      </div>
      <section className="">
        <ChatHeader newUser={newUser} />
        <div className="h-full p-4 w-full">
          {showMessages()}
          <div className="mb-48" ref={endOfMessagesRef}></div>
        </div>

        <div className="w-screen fixed bottom-0 z-20">
          <section className="w-full py-5 px-4">
            <input
              className="relative w-full pl-14 pr-3 pt-3 pb-3 outline-none border-2 border-[#75e8e7] rounded-2xl bg-gray-900 text-white text-md"
              type="text"
              placeholder="Enter your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div className="text-white absolute z-20 top-8 left-8">
              <EmojiEmotionsIcon
                sx={{ width: 30, height: 30, color: "#75e8e7" }}
              />
            </div>

            <button
              className="absolute z-20 top-8 right-8"
              type="submit"
              disabled={!messageInput}
              onClick={sendMessage}
            >
              <SendIcon sx={{ width: 30, height: 30, color: "#75e8e7" }} />
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Chat;
