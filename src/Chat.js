import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatHeader from "./components/ChatHeader";
import SendIcon from "@mui/icons-material/Send";

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
import ChatSidebar from "./components/ChatSidebar";

function Chat() {
  const { state } = useLocation();
  const { newUser, authenticatedUser } = state;
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
  };

  return (
    <main className="relative overflow-y-scroll h-screen w-screen bg-gray-900">
      <div className="absolute z-20 top-0 left-0 p-2">
        <Link to={"/"} className="text-white">
          <ChevronLeftIcon sx={{ width: 36, height: 36 }} />
        </Link>
        <Outlet />
      </div>

      <div>
        <ChatHeader newUser={newUser} />

        <div className="md:flex space-x-2">
          <div className="hidden md:block">
            <ChatSidebar loggedUser={authenticatedUser} />
          </div>

          <div className="h-full pb-48 xl:mb-24 p-4 md:px-8 flex-1">
            {showMessages()}
          </div>
        </div>

        <div className="w-full fixed bottom-0 md:right-1 xl:right-2 z-20">
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
      </div>
    </main>
  );
}

export default Chat;
