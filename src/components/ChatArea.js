import React from "react";
import MessageToDisplay from "./MessageToDisplay";

function ChatArea({ newUser, loggedUser, messages }) {
  console.log(messages);
  // messages.map((mess) => {
  //   if (
  //     // mess.newUser === newUser.email &&
  //     // // mess.id === loggedUser.id &&
  //     // mess.newUser === loggedUser.email &&
  //     // mess.id === newUser.id
  //     // mess.newUser === newUser.email &&
  //     mess.userLoggedIn === newUser.email
  //     // mess.userLoggedIn === loggedUser.email
  //     // mess.id === loggedUser.id &&
  //     // mess.newUser === newUser.email
  //   ) {
  //     console.log(mess.messages);
  //   }
  // });

  return (
    <main className="h-screen pt-6 w-full pb-44 ">
      {messages.map((mess) => {
        if (
          (mess.id === loggedUser.id && mess.newUser === newUser.email) ||
          (mess.userLoggedIn === newUser.email &&
            mess.newUser === loggedUser.email)
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
