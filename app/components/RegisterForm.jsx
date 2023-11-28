"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@UI/button";
import { useForm } from "react-hook-form";
import { Form } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import { useToast } from "@UI/use-toast";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3, { message: "Must be a valid name" }),
        email: z.string().min(1).email({ message: "Must be a valid email" }),
        password: z.string().min(3, "Invalid Password"),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { formState } = form;
  const { isSubmitting } = formState;
  const handleSubmit = async (formData) => {
    const { name, email, password } = formData;
    e.preventDefault();

    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      await res.json();
      if (res.status == 201) {
        toast({
          title: "User Registered Successfully",
        });
        router.push("/");
      }
    } catch (error) {
      setError("Error in creation");
      console.log("Error during registration: ", error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-primary">
        <h1 className="text-xl font-bold my-4">Register</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-3"
          >
            <FormInput
              className="mb-3"
              type="text"
              name="name"
              form={form}
              id="name"
              label="Full Name"
            />
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
            <Link className="text-sm mt-2 text-right" href={"/auth/login"}>
              Already have an account?<span className="underline">Login</span>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
