import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import moment from "moment";

function Sender({ messages, id, userLogged, timestamp }) {
  const [user] = useAuthState(auth);

  return (
    <main
      id={id}
      className={
        userLogged === user.email ? "flex justify-end" : "flex justify-start"
      }
    >
      <section>
        <div
          className={
            userLogged === user.email
              ? "text-black w-fit font-bold flex flex-col spce-y-1 p-2 text-sm bg-[#75e8e7] rounded-xl my-1 "
              : "text-black w-fit font-bold flex flex-col spce-y-1 p-2 text-sm bg-[#ddacf5] rounded-xl my-1"
          }
        >
          {messages}
          <span className="text-black text-xs text-right">
            {timestamp ? moment(timestamp).format("LT") : "..."}
          </span>
        </div>
      </section>
    </main>
  );
}

export default Sender;
