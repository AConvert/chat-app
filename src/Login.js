import React, { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./config/firebase";
import LoadingPage from "./LoadingPage";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

function Login() {
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [authError, setAuthError] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      <LoadingPage />;
    }
    if (error) {
      alert(error.message);
    }
    if (user) {
      const fetchUser = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let existingUser = docSnap.data();
          updateDoc(doc(db, "users", user.uid), {
            timestamp: serverTimestamp(),
          });
          navigate("/");
        }
      };

      fetchUser();
    }
  }, [user, loading, error, navigate]);

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        if (error) {
          console.log(error.message);
          setAuthError(!authError);
        }
      });
    setUserEmail("");
    setUserPassword("");
  };

  const signInGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(credential);
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        setAuthError(!authError);
        alert(credential);
        alert(errorMessage);
      });
  };

  if (!user) {
    return (
      <main className="text-white bg-gray-900 w-screen h-screen">
        <section className="flex flex-col space-y-8">
          <h1 className="text-white font-bold text-3xl text-center p-6 mt-6">
            Log in
          </h1>
          <div className="flex flex-col p-4 mx-3 space-y-5 relative">
            <h2 className="text-xs text-white text-opacity-50">
              Log in with one of the following options
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
              {authError ? (
                <div>
                  <h1 className=" w-full rounded-lg text-red-500 bg-white p-3 text-sm text-center absolute z-2 top-0 left-0">
                    Your credentials are invalid...
                  </h1>
                </div>
              ) : null}
              <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                className="border text-sm pl-4 focus:border-purple-500 focus:border-2 outline-none  text-white bg-gray-900 border-gray-700 border-opacity-80 w-full py-5 cursor-pointer  rounded-xl"
                required
                placeholder="Email"
              />
              <input
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                type="password"
                className="border text-sm pl-4 focus:border-purple-500 focus:border-2 outline-none  text-white bg-gray-900 border-gray-700 border-opacity-80 w-full py-5 cursor-pointer  rounded-xl"
                required
                placeholder="Password"
              />
              <div
                onClick={handleLogIn}
                className=" bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-400 text-lg text-center py-4 rounded-xl outline-none"
              >
                <button>Log in</button>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <h2 className="text-sm text-white text-opacity-80">
                Don't have an account?
              </h2>
              <Link
                to={"/signup"}
                className="text-md font-bold text-white hover:text-purple-500 "
              >
                Sign up
              </Link>
              <Outlet />
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Login;
