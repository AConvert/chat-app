import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import moment from "moment";

function MessageToDisplay({ message, id, timestamp }) {
  const [user] = useAuthState(auth);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    setChatMessages(message);
  }, []);

  return (
    <main
      id={id}
      className={
        chatMessages.userLoggedIn === user.email
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <section>
        <div
          className={
            chatMessages.userLoggedIn === user.email
              ? "text-black w-fit font-bold flex flex-col spce-y-1 p-2 text-sm bg-[#75e8e7] rounded-xl my-1 max-w-[240px] break-all"
              : "text-black w-fit font-bold flex flex-col spce-y-1 p-2 text-sm bg-[#ddacf5] rounded-xl my-1 max-w-[240px] break-all"
          }
        >
          {chatMessages.messages}
          <span
            className={
              chatMessages.userLoggedIn === user.email
                ? "text-black text-xs text-right"
                : "text-black text-xs text-left"
            }
          >
            {timestamp ? moment(timestamp).format("LT") : "..."}
          </span>
        </div>
      </section>
    </main>
  );
}

export default MessageToDisplay;
