import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatHeader from "./components/ChatHeader";
import ChatSendMessage from "./components/ChatSendMessage";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config/firebase";
import ChatArea from "./components/ChatArea";

function Chat() {
  const { state } = useLocation();
  const { newUser, authenticatedUser } = state;
  const [chatMessages, setChatMessages] = useState([]);
  const [messagesSorted, setMessagesSorted] = useState([]);

  useEffect(() => {
    const chatMess = [];
    const chatData = async () => {
      const docRef = query(
        collection(db, "chatList", newUser.email, "messages"),
        orderBy("timestamp", "asc")
        // where("userLoggedIn", "==", authenticatedUser.email)
      );

      onSnapshot(docRef, (messageSnap) => {
        messageSnap.forEach((message) => {
          const senderData = message.data();
          chatMess.push(senderData);
          setChatMessages(chatMess);
        });
      });
    };

    // const recipientData = async () => {
    //   const docRef = query(
    //     collection(db, "chatList", authenticatedUser.email, "messages"),
    //     where("userLoggedIn", "==", newUser.email)
    //   );
    //   onSnapshot(docRef, (messageSnap) => {
    //     messageSnap.forEach((message) => {
    //       const recData = message.data();
    //       chatMess.push(recData);
    //       setChatMessages(chatMess);
    //     });
    //   });
    // };

    // const sortByTime = chatMessages.sort((x, y) => {
    //   return x.timestamp - y.timestamp;
    // });

    // setMessagesSorted(sortByTime);

    chatData();
    // recipientData();
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
