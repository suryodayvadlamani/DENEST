"use client";
import React from "react";
import { Input } from "@UI/input";
import { Button } from "@UI/button";
import FormInput from "@components/Form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userModel } from "../../prisma/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import { useToast } from "@UI/use-toast";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { useRef } from "react";
import { createManagerFn } from "@/app/helpers/tenantRoom";

const AddManager = () => {
  const userSchema = userModel.omit({ id: true });
  const { toast } = useToast();
  const cancelRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      aadhar: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: "",
      district: "",
      state: "",
      country: "",
      contactNumber: "",
    },
  });
  const queryClient = useQueryClient();

  const { mutate: postManager, isLoading: mutationLoading } =
    createManagerFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      postManager(data);
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6 lg:px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <UserForm form={form} />
          <FormInput
            className="mb-3"
            name="aadhar"
            form={form}
            id="aadharText"
            type="tel"
            label="Aadhar Number"
          />
          <AddressForm form={form} />

          <Button
            className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
            type="submit"
            isLoading={mutationLoading}
            disabled={mutationLoading}
          >
            Submit
          </Button>
          <DialogClose asChild>
            <Button
              ref={cancelRef}
              className="flex w-20 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
            >
              Cancel
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  );
};

export default AddManager;
