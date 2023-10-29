"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@UI/button";
import { useSession } from "next-auth/react";
const UserInfo = () => {
  const { data: session } = useSession();
  const signOutUrl = process.env.NEXT_PUBLIC_AUTH0_SIGNOUT_CALLBACK_URL;
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: signOutUrl })}
          className="font-bold px-6 py-2 mt-3"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
