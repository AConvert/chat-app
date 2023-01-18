import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import SignUp from "./SignUp";
import Chat from "./Chat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className=" font-Roboto bg-gray-900">
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
