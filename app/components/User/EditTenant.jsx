"use client";
import React, { Suspense, useEffect, useState } from "react";
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
import { getUserById, updateUser } from "@/app/server_functions/User";

const EditTenant = () => {
  const userSchema = userModel.omit({ id: true });
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const usersData = useStore((state) => {
    return state.users.filter((x) => x.id == userId)[0];
  });

  const [data, setData] = useState(usersData);
  useEffect(() => {
    const getData = async () => {
      const { data: usersData } = await getUserById(userId);
      setData(usersData);
    };
    if (!data) {
      getData();
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      aadhar: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      contact: "",
      isActive: "",
      createdDate: new Date(),
    },
  });
  const { formState, reset } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (data) {
      reset({
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
      });
    }
  }, [data]);

  const route = useRouter();
  const goBack = (e) => {
    e.preventDefault();
    route.replace("/userManagment", { scroll: false });
  };

  const onSubmit = async (formData) => {
    const { isError } = await updateUser(userId, formData);

    if (!isError) route.replace("/userManagment");
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
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="flex  justify-center gap-2"
              >
                Submit
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
