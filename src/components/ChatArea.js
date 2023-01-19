import React from "react";
import MessageToDisplay from "./MessageToDisplay";

function ChatArea({ newUser, loggedUser, messages }) {
  return (
    <main className="h-screen pt-6 w-full pb-44 ">
      {messages.map((mess) => {
        if (
          mess.userLoggedIn === loggedUser.email ||
          mess.userLoggedIn === newUser.email
        ) {
          return (
            <MessageToDisplay
              id={mess.id}
              key={mess.id}
              userLogged={mess.userLoggedIn}
              newUser={newUser}
              messages={mess.messages}
              timestamp={new Date(mess.timestamp * 1000)}
            />
          );
        }
      })}
    </main>
  );
}

export default ChatArea;
