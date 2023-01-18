import React, { useEffect } from "react";
import { Avatar } from "@mui/material";

function ContactCard({ name, email, id, enterChat }) {
  return (
    <main
      onClick={enterChat}
      id={id}
      className="w-full transition-all my-2 cursor-pointer "
    >
      <section className="flex items-center space-x-2 p-2 hover:bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 mx-3 rounded-xl">
        <Avatar sx={{ width: 50, height: 50, bgcolor: "#ddacf5" }}>
          {name[0]}
        </Avatar>
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold text-md text-white">{name}</h1>
          <h2 className="text-xs text-white text-opacity-70">{email}</h2>
        </div>
      </section>
    </main>
  );
}

export default ContactCard;
