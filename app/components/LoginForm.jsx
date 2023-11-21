"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@UI/button";
import { useForm } from "react-hook-form";
import { Form } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import { useSearchParams, useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1).email({ message: "Must be a valid email" }),
        password: z.string().min(3, "Invalid Password"),
      })
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { formState } = form;
  const { isSubmitting } = formState;
  const onSubmit = async (formData) => {
    const { email, password } = formData;
    setError("");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log({ callbackUrl, res });
      if (res?.status != 200) {
        setError("Invalid Credentials");
        return;
      }

      router.replace(callbackUrl || "/hostels");
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormInput
              className="mb-3"
              type="text"
              name="email"
              form={form}
              id="userEmail"
              label="Email"
            />
            <FormInput
              className="mb-3"
              type="password"
              name="password"
              form={form}
              id="userPassword"
              label="Password"
            />
            <Button
              className="font-bold cursor-pointer px-6 py-2"
              variant="secondary"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </Button>
          </form>
          {error && (
            <div className="w-fit text-sm py-1 px-3 rounded-md mt-3 mb-1">
              {error}
            </div>
          )}
          <div className="mt-4 ">
            <Link className="text-sm mt-2 text-right" href={"/auth/register"}>
              Don't have an account? <span className="underline">Register</span>
            </Link>
          </div>
        </Form>

        <div className="flex flex-row gap-4 mt-5 justify-around">
          {providers.map(({ name, Icon }) => (
            <Button
              key={name}
              className="gap-2 capitalize"
              onClick={() => signIn(name, { callbackUrl: "/hostels" })}
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
