import React from "react";
import { Avatar } from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Bars2Icon } from "@heroicons/react/20/solid";

function ContactCard({ name, email, id, enterChat, deleteChat }) {
  function DeleteInactiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="6"
          width="10"
          height="10"
          fill="#EDE9FE"
          stroke="#A78BFA"
          strokeWidth="2"
        />
        <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
        <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
      </svg>
    );
  }

  function DeleteActiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="6"
          width="10"
          height="10"
          fill="#8B5CF6"
          stroke="#C4B5FD"
          strokeWidth="2"
        />
        <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
        <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <main id={id} className="w-full transition-all my-2 cursor-pointer ">
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 lg:hover:bg-gradient-to-r lg:from-purple-700 lg:via-fuchsia-500 lg:to-pink-400 mx-3 rounded-xl">
        <div onClick={enterChat} className="flex items-center space-x-2 ">
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#ddacf5",
              color: "#111827",
              fontSize: "x-large",
              fontWeight: "bold",
            }}
          >
            {name[0]}
          </Avatar>
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-md md:text-md lg:text-lg text-white">
              {name}
            </h1>
            <h2 className="text-xs md:text-sm lg:text-md text-white text-opacity-70">
              {email}
            </h2>
          </div>
        </div>

        <div>
          <div>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <Bars2Icon className="w-6 h-6 text-white" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute z-20 right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-600 shadow-sm shadow-gray-400 backdrop-blur-lg bg-opacity-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item onClick={deleteChat}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-violet-500 text-white" : "text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <DeleteActiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <DeleteInactiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          )}
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactCard;
