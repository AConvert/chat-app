import React, { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, auth } from "./config/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingPage from "./LoadingPage";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignUp() {
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [errorAuth, setErrorAuth] = useState(false);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      <LoadingPage />;
    }

    if (user) {
      setDoc(
        doc(db, "users", user.uid),
        {
          name: userName,
          displayName: user.displayName,
          email: user.email,
          id: user.uid,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/");
    } else {
      signOut(auth);
    }
  }, [user, loading, navigate, userName]);

  const addUser = async () => {
    await createUserWithEmailAndPassword(auth, userEmail, userPassword).catch(
      (error) => {
        console.log(error.message);
        setErrorAuth(!errorAuth);
      }
    );
  };

  const signInGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider()).catch((error) => {
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert(credential);
      alert(errorMessage);
    });
  };

  return (
    <main className="text-white bg-gray-900 w-screen h-screen">
      <section className="flex flex-col space-y-8">
        <h1 className="text-white font-bold text-3xl text-center p-6 mt-6">
          Sign up
        </h1>
        <div className="flex flex-col p-4 mx-3 space-y-5 relative">
          <h2 className="text-xs text-white text-opacity-50">
            Sign up with one of the following options
          </h2>
          <div className="grid place-items-center ">
            <button
              onClick={signInGoogle}
              className="border border-gray-700 border-opacity-80 w-full py-3 cursor-pointer focus:border-purple-500 focus:border-2  rounded-xl"
            >
              <GoogleIcon
                sx={{ height: 32, width: 32 }}
                className="w-6 h-6  text-white "
              />
            </button>
          </div>
          <div className="w-full flex flex-col space-y-6 ">
            {errorAuth ? (
              <div>
                <h1 className=" w-full rounded-lg text-red-500 bg-white p-3 text-sm text-center absolute z-2 top-0 left-0">
                  This email is already in use...
                </h1>
              </div>
            ) : null}
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="border text-sm pl-4 focus:border-purple-500 focus:border-2 outline-none  text-white bg-gray-900 border-gray-700 border-opacity-80 w-full py-5 cursor-pointer  rounded-xl"
              required
              placeholder="Name"
            />

            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              className=" border text-sm pl-4 focus:border-purple-500 focus:border-2 outline-none  text-white bg-gray-900 border-gray-700 border-opacity-80 w-full py-5 cursor-pointer  rounded-xl"
              required
              placeholder="tim@gmail.com"
            />

            <input
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              type="password"
              className="border text-sm pl-4 focus:border-purple-500 focus:border-2 outline-none  text-white bg-gray-900 border-gray-700 border-opacity-80 w-full py-5 cursor-pointer  rounded-xl"
              required
              placeholder="Pick a strong password"
            />

            <div
              onClick={addUser}
              className=" bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 text-lg text-center py-4 rounded-xl outline-none disabled:focus:bg-gray-500"
            >
              <button disabled={!userEmail || !userPassword}>
                Create Account
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <h2 className="text-sm text-white text-opacity-80">
              Already have an account?
            </h2>
            <Link
              to="/login"
              className="text-md font-bold text-white hover:text-purple-500 "
            >
              Log in
            </Link>
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default SignUp;
