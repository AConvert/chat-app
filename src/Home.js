import React from "react";
import Sidebar from "./components/Sidebar";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import LoadingPage from "./LoadingPage";
import Login from "./Login";

function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingPage />;
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (!user) {
    <Login />;
  }
  return (
    <main>
      <section>
        <Sidebar />
      </section>
    </main>
  );
}

export default Home;
