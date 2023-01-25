import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import moment from "moment";

function ChatHeader({ newUser }) {
  const [lastSeen, setLastSeen] = useState("");

  useEffect(() => {
    const fetchRecTimestamp = async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", newUser.email)
      );

      const recSnap = await getDocs(q);
      recSnap.docs.map((rec) => {
        if (rec.exists()) {
          setLastSeen(moment(rec.timestamp).format("LT"));
        }
      });
    };

    fetchRecTimestamp();
  }, [newUser]);

  return (
    <main>
      <div className="flex items-center justify-center space-x-4 py-8 border-b border-gray-500 border-opacity-50">
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "#75e8e7",
            color: "black",
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          {newUser?.name[0]}
        </Avatar>
        <div className="fle flex-col space-y-1">
          <h1 className="text-md font-semibold text-white">{newUser.name}</h1>

          <p className="text-sm text-white text-opacity-70">
            Last active:{lastSeen ? lastSeen : "..."}
          </p>
        </div>
      </div>
    </main>
  );
}

export default ChatHeader;
