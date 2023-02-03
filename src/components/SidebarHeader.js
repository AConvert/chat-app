import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import LoadingPage from "../LoadingPage";
import { v4 as uuidv4 } from "uuid";
import { AdjustmentsVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import moment from "moment";

function SidebarHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [foundExistingEmail, setFoundExistingEmail] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [replaceName, setReplaceName] = useState("");
  const [chatName, setChatName] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [signOut] = useSignOut(auth);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  function LogoutInactiveIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  function LogoutActiveIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => setIsModalOpen(false));

  function useOnClickOutside(modalRef, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (!modalRef.current || modalRef.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [modalRef, handler]);
  }

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const chatRef = query(
          collection(db, "chatList"),
          where("users", "array-contains", user.email)
        );

        onSnapshot(chatRef, (chatSnap) => {
          const chatData = [];
          chatSnap.docs.map((chat) => {
            const recData = chat.data();
            chatData.push(recData);
            const filteredData = chatData.filter(
              (chat) => chat.loggedUser === user.email
            );
            setContactList(filteredData);
          });
        });
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);

    const checkExistingUser = (userEmail) => {
      let existingEmail = contactList.findIndex(
        (contact) => contact.newUserEmail === userEmail
      );
      if (existingEmail >= 0) {
        setFoundExistingEmail(!foundExistingEmail);
      } else {
        setDoc(doc(db, "chatList", chatEmail), {
          users: [user.email, chatEmail],
          newUserName: chatName.toUpperCase(),
          newUserEmail: chatEmail,
          loggedUser: user.email,
          id: uuidv4(),
        });
        setFoundExistingEmail(false);
      }
    };

    checkExistingUser(chatEmail);

    setChatEmail("");
    setChatName("");
  };

  useEffect(() => {
    if (loading) {
      <LoadingPage />;
    }
    if (error) {
      alert(error.message);
    }
    if (user) {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let userInfo = [];
          let d = doc.data();
          userInfo.push({
            name: d.name,
            displayName: d.displayName,
            photo: d.photoURL,
            id: d.id,
            timestamp: new Date(d.timestamp * 1000),
          });
          setUserName(userInfo[0]?.name.toUpperCase());
          setReplaceName(userInfo[0]?.displayName.toUpperCase());
          setProfilePic(userInfo[0]?.photoURL);
          setLastSeen(moment(userInfo[0]?.timestamp).format("LT"));
        });
      });
    } else {
      signOut(auth);
      navigate("/login");
    }
  }, [user, loading, error, navigate, signOut]);

  return (
    <main className="w-full">
      <section className="flex items-center justify-between p-2 md:py-4 md:pr-12 md:pl-16 border-y border-gray-500 border-opacity-50">
        <div className="flex items-center justify-start  space-x-3 p-4">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "#75e8e7",
              color: "black",
              fontSize: 32,
              fontWeight: "bold",
            }}
            src={profilePic}
            alt="user_profileImg"
            referrerPolicy="no-referrer"
          >
            {(!profilePic && userName?.charAt(0)) || replaceName.charAt(0)}
          </Avatar>
          <div className="flex flex-col space-y-1">
            <h1 className=" font-bold text-md md:text-lg lg:text-xl text-white overflow-hidden">
              {!userName ? replaceName : userName}
            </h1>
            <h3 className="text-xs text-white text-opacity-70">My account</h3>
            <h2 className="text-xs text-white text-opacity-70">
              {" "}
              Last active: {lastSeen}
            </h2>
          </div>
        </div>

        <section className="flex justify-center items-center space-x-6 md:px-8">
          <div className=" w-48 my-4 hidden md:block">
            <button
              onClick={(e) => setIsModalOpen(!isModalOpen)}
              className="w-full md:text-md   relative bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 text-sm p-3 rounded-xl text-black outline-none"
            >
              Start a new chat
            </button>
            {isModalOpen ? (
              <div
                ref={modalRef}
                className="w-full md:max-w-md lg:max-w-lg flex justify-center absolute z-20 left-0 top-24 md:top-24 md:left-48 lg:left-96 xl:left-[750px] "
              >
                <form
                  onSubmit={chatEmail && chatName ? handleSubmit : null}
                  className="bg-gray-600 shadow-sm shadow-gray-400 backdrop-blur-lg bg-opacity-60 w-full rounded-lg mx-6 flex flex-col items-center space-y-4 px-4 py-8"
                >
                  <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    className="p-3 w-full bg-transparent border-b-2 border-b-gray-100 outline-none placeholder-white placeholder-opacity-90  text-white text-md pl-2"
                    required
                    placeholder="Enter a name..."
                  />
                  <input
                    type="email"
                    value={chatEmail}
                    onChange={(e) => setChatEmail(e.target.value)}
                    className="p-3 w-full bg-transparent border-b-2 border-b-gray-100 outline-none placeholder-white placeholder-opacity-90  text-white text-md pl-2"
                    required
                    placeholder="Enter an email"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 text-black text-md text-center disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </form>
              </div>
            ) : null}
          </div>

          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md  bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <AdjustmentsVerticalIcon className="w-6 h-6" />
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
              <Menu.Items className="absolute z-20 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-600 shadow-sm shadow-gray-400 backdrop-blur-lg bg-opacity-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item onClick={handleLogout}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-violet-500 text-white" : "text-white"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <LogoutActiveIcon
                            className="mr-4 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : (
                          <LogoutInactiveIcon
                            className="mr-4 h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </section>
      </section>
    </main>
  );
}

export default SidebarHeader;
