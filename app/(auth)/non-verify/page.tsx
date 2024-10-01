"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

const NonVerify = () => {
  const authContext = useAuth();
  const router = useRouter();

  const handleLogout = async() => {
    await authContext.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-8">
              <p className="text-lg font-bold text-gray-700 text-center mb-6">
                Your account is waiting to be verified.
              </p>
              <p className="text-md text-gray-600 text-center mb-8">
                Please contact Frenztalk Admin for more information.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* TODO: Add contact admin button */}
                {/* <button
                  type="button"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => {
                    console.log("Logged out");
                  }}
                >
                  Contact Admin
                </button> */}
                <button
                  type="button"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-6 rounded-lg border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonVerify;
