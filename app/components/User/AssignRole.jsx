"use client";

import React, { useRef } from "react";
import { Input } from "@UI/input";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getRolesFn } from "@/app/helpers/roles";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@UI/select";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import { z } from "zod";
import { createUserRoleFn } from "@/app/helpers/userRole";
import { getHostelsFn } from "@/app/helpers/hostel";
import { DialogClose } from "@radix-ui/react-dialog";
const page = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { status, data: session } = useSession({ required: true });
  const { isLoading, data, isError, error } = getRolesFn();

  const { data: hostelData } = getHostelsFn();

  useEffect(() => {
    function select_role() {
      const userRoleId = session?.user.roleId;
      let sr;
      const rolesData = data?.data || [];
      let roleName = rolesData
        .filter((role) => userRoleId === role.id)
        .map((role) => role.name)[0];

      if (roleName === "OWNER") {
        sr = rolesData.filter((role) => role.name != "ADMIN");
      } else if (roleName === "MANAGER") {
        sr = rolesData.filter(
          (role) => role.name != "ADMIN" || role.name == "OWNER"
        );
      } else {
        sr = rolesData;
      }

      setSelectedRoles(sr);
    }
    select_role();
  }, [data?.data]);

  const cancelRef = useRef(null);
  const userRolesSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    role: z.enum(["ADMIN", "OWNER", "MANAGER", "TENANT"]),
    hostelId: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(userRolesSchema),
    defaultValues: {
      email: "",
      role: "",
      hostelId: "",
    },
  });
  const { mutate: createuserRole, isLoading: mutationLoading } =
    createUserRoleFn(cancelRef);

  const onSubmit = async (data) => {
    const body_data = {
      userEmail: data.email,
      roleName: data.role,
      roleId: selectedRoles.filter((r) => r.name === data.role)[0].id,
      isActive: true,
      vendorId: session.user.vendorId,
      hostelId: data.hostelId || session.user.hostelId,
    };

    try {
      createuserRole(body_data);
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  if (status == "loading") return "loading";
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      {form && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem id="formItemEmail" className="relative pt-2">
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder=""
                        className="peer placeholder-transparent mt-1  w-full rounded-md py-1.5    sm:text-sm sm:leading-6"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="email"
                      className="absolute left-0 -top-5 mt-4 px-3 text-white-900 text-sm transition-all 
                    peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                    peer-focus:-top-5
                    peer-focus:text-sm
                    peer-focus:text-white-900
                    peer-placeholder-shown:top-2"
                    >
                      Email
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {session?.role == "OWNER" && (
                <FormField
                  control={form.control}
                  name="hostelId"
                  render={({ field }) => (
                    <FormItem id="formItemRole" className="relative pt-2">
                      <FormLabel>Hostel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hostelData?.data.map((hostel) => {
                            return (
                              <SelectItem
                                key={hostel.id}
                                value={`${hostel.id}`}
                              >
                                {hostel.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem id="formItemRole" className="relative pt-2">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedRoles.map((r) => {
                          return (
                            <SelectItem key={r.id} value={`${r.name}`}>
                              {r.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row mt-4 justify-around">
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
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default page;
