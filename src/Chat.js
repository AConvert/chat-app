import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatHeader from "./components/ChatHeader";
import ChatSendMessage from "./components/ChatSendMessage";

import ChatArea from "./components/ChatArea";
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./config/firebase";

function Chat() {
  const { state } = useLocation();
  const { newUser, authenticatedUser } = state;
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const chatMess = [];
    const chatData = async () => {
      const docRef = query(
        collectionGroup(db, "messages"),
        orderBy("timestamp", "asc")
      );

      onSnapshot(docRef, (snapshot) => {
        snapshot.forEach((doc) => {
          chatMess.push(doc.data());
          setChatMessages(chatMess);
        });
      });
    };
    chatData();
  }, []);

  return (
    <main className="relative h-full w-screen bg-gray-900">
      <div className="absolute z-20 top-0 left-0 p-2">
        <Link to={"/"} className="text-white">
          <ChevronLeftIcon sx={{ width: 36, height: 36 }} />
        </Link>
        <Outlet />
      </div>
      <section className="h-full">
        <ChatHeader newUser={newUser} />
        <ChatArea
          messages={chatMessages}
          newUser={newUser}
          loggedUser={authenticatedUser}
        />
        <div className="fixed bottom-0 z-20">
          <ChatSendMessage newUser={newUser} />
        </div>
      </section>
    </main>
  );
}

export default Chat;
