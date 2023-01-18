import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatHeader from "./components/ChatHeader";
import ChatSendMessage from "./components/ChatSendMessage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./config/firebase";
import ChatArea from "./components/ChatArea";

function Chat() {
  const { state } = useLocation();
  const { newUser, authenticatedUser } = state;
  const [chatMessages, setChatMessages] = useState([]);
  const [messagesSorted, setMessagesSorted] = useState([]);

  useEffect(() => {
    const chatMess = [];

    const senderData = async () => {
      const docRef = query(
        collection(db, "chatList", newUser.email, "messages")
        // where("userLoggedIn", "==", authenticatedUser.email)
      );
      onSnapshot(docRef, (messageSnap) => {
        messageSnap.docs.map((message) => {
          console.log(message.data());
          // const senderData = message.data();
          // console.log(senderData);
          // chatMess.push(senderData);
        });
      });
    };

    const recipientData = async () => {
      const docRef = query(
        collection(db, "chatList", authenticatedUser.email, "messages"),
        where("userLoggedIn", "==", newUser.email)
      );
      onSnapshot(docRef, (messageSnap) => {
        messageSnap.forEach((message) => {
          const recData = message.data();
          chatMess.push(recData);
          setChatMessages(chatMess);
        });
      });
    };

    // const sortByTime = chatMessages.sort((x, y) => {
    //   return x.timestamp - y.timestamp;
    // });

    // setMessagesSorted(sortByTime);

    senderData();
    recipientData();
  }, []);

  console.log(chatMessages);

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
