import React from "react";
import Sender from "./Sender";

function ChatArea({ messages }) {
  console.log(messages);
  return (
    <main className="h-full pt-6 w-full pb-44 ">
      {messages.map((message) => (
        <Sender
          id={message.id}
          key={message.id}
          userLogged={message.userLoggedIn}
          messages={message.messages}
          timestamp={new Date(message.timestamp * 1000)}
        />
      ))}
    </main>
  );
}

export default ChatArea;
