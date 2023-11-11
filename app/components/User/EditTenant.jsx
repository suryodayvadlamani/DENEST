"use client";
import React, { Suspense, useEffect } from "react";
import { Button } from "@UI/button";
import FormInput from "@components/Form/FormInput";
import UserFormLoader from "@components/loaders/UserForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userModel } from "../../../prisma/zod";
import { Switch } from "@UI/switch";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@UI/form";
import { useToast } from "@UI/use-toast";
import UserForm from "@components/UserForm";
import AddressForm from "@components/AddressForm";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { updateUserByIdFn } from "@/app/helpers/user";
import { useStore } from "@/app/store/store";

const EditTenant = () => {
  const userSchema = userModel.omit({ id: true });
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const usersData = useStore((state) => {
    if (state.users.length) return state.users.filter((x) => x.id == userId)[0];
  });
  useEffect(() => {
    const getData = async () => {
      const { data: userData } = await getUsers();
      useStore.setState({
        vendors: userData,
      });
    };
    if (!data) {
      getData();
    }
  }, []);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: usersData.name,
      email: usersData.email,
      profession: usersData.profession,
      aadhar: usersData.aadhar,
      addressLine1: usersData.addressLine1,
      addressLine2: usersData.addressLine2,
      pincode: usersData.pincode,
      district: usersData.district,
      state: usersData.state,
      country: usersData.country,
      contact: usersData.contact,
      isActive: usersData.isActive,
      createdDate: new Date(),
    },
  });
  const { reset } = form;

  const route = useRouter();
  const goBack = (e) => {
    e.preventDefault();
    route.replace("/userManagment");
  };

  const {
    mutate: updateUser,
    isLoading: mutationLoading,
    isSuccess,
  } = updateUserByIdFn();
  if (isSuccess) route.replace("/userManagment");
  const onSubmit = (data) => {
    updateUser({ id: userId, data: data });
  };

  return (
    <Suspense fallback={<UserFormLoader />}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
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
            <FormInput
              className="mb-3"
              name="profession"
              form={form}
              id="professionText"
              type="text"
              label="Profession"
            />

            <AddressForm form={form} />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between ">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3 justify-around">
              <Button
                className="flex  justify-center gap-2"
                disabled={mutationLoading}
                type="submit"
                isLoading={mutationLoading}
              >
                Update
              </Button>
              <Button
                className="flex w-20 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
                onClick={(e) => goBack(e)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Suspense>
  );
};

export default EditTenant;
