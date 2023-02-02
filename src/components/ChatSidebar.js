import { Avatar } from "@mui/material";
import React from "react";

function ChatSidebar({ loggedUser }) {
  return (
    <main className="h-screen w-full transition-all my-2 cursor-pointer ">
      <section className="flex w-full mt-5 items-center space-x-2 p-2 bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 mx-3 rounded-xl">
        <Avatar sx={{ width: 50, height: 50, bgcolor: "#ddacf5" }}>
          {loggedUser.email[0].toUpperCase()}
        </Avatar>
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold text-md md:text-lg lg:text-xl xl:text-2xl text-white">
            {loggedUser.displayName ? loggedUser?.displayName : null}
          </h1>
          <h2 className="text-xs md:text-md lg:text-lg xl:text-xl text-white text-opacity-70">
            {loggedUser?.email}
          </h2>
        </div>
      </section>
    </main>
  );
}

export default ChatSidebar;
