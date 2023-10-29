import { getServerSession } from "next-auth/next";
import React from "react";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function AuthWrapper({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}

export default AuthWrapper;
