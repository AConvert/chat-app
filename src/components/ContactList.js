import React, { useEffect, useRef, useState } from "react";
import ContactCard from "./ContactCard";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function ContactList() {
  const [contactList, setContactList] = useState([]);
  const [authenticatedUser, setAuthenticatedUser] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [foundExistingEmail, setFoundExistingEmail] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const modalRef = useRef();
  useOnClickOutside(modalRef, () => setIsOpen(false));

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

  useEffect(() => {
    if (user) {
      setAuthenticatedUser({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoUrl: user.photoURL,
      });

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
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);

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

  const enterChat = (chatEmail) => {
    const findChat = contactList.find((c) => c.newUserEmail === chatEmail);
    if (findChat) {
      navigate(`chat/${findChat.id}`, {
        state: {
          newUser: {
            name: findChat.newUserName,
            email: findChat.newUserEmail,
            id: findChat.id,
          },
          authenticatedUser: {
            name: user.displayName,
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL,
          },
        },
      });
    }
  };

  const deleteChat = (userEmail) => {
    const docRef = doc(db, "chatList", userEmail);
    deleteDoc(docRef).catch((error) => {
      console.log(error);
    });
  };

  return (
    <main className="h-screen w-screen overflow-y-scroll scrollbar-hide">
      {foundExistingEmail ? (
        <div>
          <h1 className="text-md bg-white text-center text-red-500 p-2 absolute z-20 top-52 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]">
            Email already registered...
          </h1>
        </div>
      ) : null}
      <section className="w-full ">
        <div className="w-screen md:hidden flex items-center justify-center border border-gray-500 border-opacity-50">
          <div className="w-full my-4 mx-16 ">
            <button
              onClick={(e) => setIsOpen(!isOpen)}
              className="w-full  relative bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 text-md p-3 rounded-xl text-black outline-none"
            >
              Start a new chat
            </button>

            {isOpen ? (
              <div
                ref={modalRef}
                className="w-full flex justify-center absolute z-20 left-0 top-24 "
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
        </div>
        <div>
          <div className="flex items-center ">
            <h1 className="text-white font-bold text-md md:text-lg lg:text-xl pl-6 md:ml-16 pt-4 pb-4 md:pt-6 md:pb-6 pr-1">
              Chats
            </h1>
            <div className="relative">
              <div className=" rounded-full w-6 h-4 bg-[#75e8e7]"></div>
              <p className="absolute z-2 top-0 left-1/4 text-black text-xs  ">
                {contactList?.length}
              </p>
            </div>
          </div>
        </div>
        <section className="md:mr-16 md:ml-16 ">
          {contactList.map((chat) => (
            <ContactCard
              id={chat.id}
              key={chat.id}
              name={chat.newUserName}
              email={chat.newUserEmail}
              enterChat={() => enterChat(chat.newUserEmail)}
              deleteChat={() => deleteChat(chat.newUserEmail)}
            />
          ))}
        </section>
      </section>
    </main>
  );
}

export default ContactList;
