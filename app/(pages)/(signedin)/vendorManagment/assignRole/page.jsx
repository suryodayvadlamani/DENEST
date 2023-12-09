"use client";

import React, { useMemo } from "react";
import { Input } from "@UI/input";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import { getRolesFn } from "@/app/helpers/roles";
import { useToast } from "@UI/use-toast";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from "react";
import { postCall } from "../../../../helpers/httpHelper";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVendorsFn } from "@/app/helpers/vendor";
const page = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { status, data: session } = useSession({ required: true });
  const { data } = getRolesFn();
  const { data: vendorData } = getVendorsFn();

  const flatData = useMemo(() => {
    if (!vendorData?.pages[0]) return [];
    return vendorData?.pages?.flatMap((page) => page?.data?.data) ?? [];
  }, [vendorData?.pages]);

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

  const userRolesSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    role: z.enum(["ADMIN", "OWNER", "MANAGER", "TENANT"]),
    vendorId: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(userRolesSchema),
    defaultValues: {
      email: "",
      role: "",
      vendorId: "",
    },
  });

  const onSubmit = async (data) => {
    const selectedRole = selectedRoles.filter((r) => r.name === data.role)[0];
    const body_data = {
      userEmail: data.email,
      roleId: selectedRole.id,
      vendorId: data.vendorId,
      hostelId: "",
      isActive: true,
      roleName: selectedRole.name,
    };

    try {
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  const router = useRouter();

  const goBack = (e) => {
    e.preventDefault();
    router.back();
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
              <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem id="formItemRole" className="relative pt-2">
                    <FormLabel>Vendor</FormLabel>
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
                        {flatData?.map((vendor) => {
                          return (
                            <SelectItem key={vendor.id} value={`${vendor.id}`}>
                              {vendor.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="flex gap-4 mt-3 justify-around">
                <Button type="submit">Assign</Button>
                <Button type="cancel" onClick={(e) => goBack(e)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default page;
