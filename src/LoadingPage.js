import React from "react";
import { DotLoader } from "react-spinners";

function LoadingPage() {
  return (
    <main className="bg-gray-900 h-screen w-screen grid place-items-center">
      <section className="">
        <div className="flex flex-col items-center space-y-6">
          <img
            src="/images/app_logo.png"
            className="w-62 h-62"
            loading="lazy"
            alt="chat_logo"
          />
          <DotLoader loading={true} size={50} color="#fff" />
        </div>
      </section>
    </main>
  );
}

export default LoadingPage;
