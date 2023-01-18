import React from "react";
import ContactList from "./ContactList";
import SidebarHeader from "./SidebarHeader";

function Sidebar() {
  return (
    <main className="w-screen h-screen">
      <section className="bg-gray-900 flex flex-col">
        <SidebarHeader />
        <ContactList />
      </section>
    </main>
  );
}

export default Sidebar;
