import React, { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Avatar } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import LoadingPage from "../LoadingPage";
// import TimeAgo from "timeago-react";

function SidebarHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [replaceName, setReplaceName] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [signOut] = useSignOut(auth);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    signOut(auth);
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
            timestamp: new Date(d.createdAt?.toDate()).toLocaleTimeString(),
          });
          setUserName(userInfo[0]?.name);
          setReplaceName(userInfo[0]?.displayName);
          setProfilePic(userInfo?.photoURL);
          setLastSeen(userInfo[0]?.timestamp);
        });
      });
    } else {
      signOut(auth);
      navigate("/login");
    }
  }, [user, loading, error, navigate, signOut]);

  return (
    <main className="w-full">
      <section className="flex items-center justify-between p-2 border border-gray-500 border-opacity-50">
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
            src={`${profilePic}`}
            alt="user_profileImg"
            referrerPolicy="no-referrer"
          >
            {(!profilePic && userName?.charAt(0)) || replaceName.charAt(0)}
          </Avatar>
          <div className="flex flex-col space-y-1">
            <h1 className=" font-bold text-md text-white overflow-hidden">
              {!userName ? replaceName : userName}
            </h1>
            <h3 className="text-xs text-white text-opacity-70">My account</h3>
            <h2 className="text-xs text-white text-opacity-70">
              {" "}
              Last active: {lastSeen}
            </h2>
          </div>
        </div>

        <div className="relative rounded-full p-1 border border-opacity-40 cursor-pointer border-gray-200 mr-4">
          <MoreVertIcon
            onClick={(e) => setIsOpen(!isOpen)}
            className="text-white "
            sx={{ height: 28, width: 28 }}
          />
        </div>
        {isOpen && (
          <button
            ref={modalRef}
            onClick={handleLogout}
            className="absolute z-20 top-[86px] right-6 text-sm bg-gray-400  px-4 py-2 rounded-lg text-white hover:bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 outline-none"
          >
            Logout
          </button>
        )}
      </section>
    </main>
  );
}

export default SidebarHeader;
