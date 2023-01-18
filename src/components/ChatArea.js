import React from "react";
import MessageToDisplay from "./MessageToDisplay";

function ChatArea({ messages }) {
  console.log(messages);
  return (
    <main className="h-screen pt-6 w-full pb-44 ">
      {messages.map((message) => (
        <MessageToDisplay
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
