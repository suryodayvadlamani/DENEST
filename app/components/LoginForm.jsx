"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import { Button } from "@UI/button";
import { Input } from "@UI/input";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      console.log("Login Form error", error);
    }
  };
  const providers = [
    {
      name: "google",
      Icon: BsGoogle,
    },
    {
      name: "facebook",
      Icon: BsFacebook,
    },
  ];
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-2xl shadow-lg p-5 rounded-lg border-t-4 border-primary">
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <Button
            className="font-bold cursor-pointer px-6 py-2"
            variant="outline"
          >
            Login
          </Button>
          {error && (
            <div className="w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/auth/register"}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
        <div className="flex flex-row gap-4 mt-5 justify-around">
          {providers.map(({ name, Icon }) => (
            <Button
              key={name}
              className="gap-2 capitalize"
              onClick={() => signIn(name, { callbackUrl: "/dashboard" })}
            >
              <Icon />
              {name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
