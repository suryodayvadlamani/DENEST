"use client";

import React, { useRef, useState } from "react";
import { createTenantPayFn } from "@/app/helpers/tenantpay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@UI/button";
import FormInput from "@components/Form/FormInput";
import FormCalendar from "@components/Form/FormCalendar";
import FormSelect from "@components/Form/FormSelect";
import { Form } from "@UI/form";
import { Separator } from "@UI/separator";
import { tenantPayModel } from "@/prisma/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { getUserById } from "@/app/helpers/user";
import { Label } from "@UI/label";
import { z } from "zod";
const AddTenantPay = () => {
  const [userName, setUserName] = useState("");
  const cancelRef = useRef(null);
  const tenantPaySchema = tenantPayModel.omit({ id: true }).extend({
    tenantContact: z
      .string({ message: "Must be 10 digit number" })
      .min(10, { message: "Must be 10 digit number" }),
  });
  const form = useForm({
    resolver: zodResolver(tenantPaySchema),
    defaultValues: {
      userId: "",
      amount: 0,
      paymentType: "",
      startDate: "",
      endDate: "",
      paidDate: "",
    },
  });
  const { getFieldState, trigger, formState, setError, clearErrors } = form;
  const { errors } = formState;
  const { mutate: postTenantPay, isLoading: mutationLoading } =
    createTenantPayFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      postTenantPay(data);
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  const searchCallback = async (value) => {
    try {
      await trigger("tenantContact");
      const { error } = getFieldState("tenantContact");
      if (!error?.message) {
        const data = await getUserById(value);
        if (data.status == 200) {
          clearErrors("tenantContact");

          setUserName(data?.data.name);
        } else {
          setError("tenantContact", {
            type: "manual",
            message:
              "Please check your contact number otherwise create a new tenant",
          });
        }
      }
    } catch (e) {
      console.log("inside this", e);
    }
  };
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <FormInput
              className="mb-3"
              name="tenantContact"
              form={form}
              id="tenantContact"
              type="tel"
              maxLength="10"
              minLength="10"
              label="Contact"
              required
              isSearchable={true}
              searchCallback={searchCallback}
            />
            {userName && (
              <>
                <Label className="ml-4 text-primary">{userName}</Label>
                <Separator className="my-2" />
              </>
            )}
            <FormInput
              className="mb-3"
              name="amount"
              form={form}
              id="expenseAmount"
              type="number"
              label="Amount"
              required
            />

            <FormCalendar name="startDate" form={form} label="Start Date" />
            <FormCalendar name="endDate" form={form} label="End Date" />
            <FormCalendar name="paidDate" form={form} label="Paid Date" />
            <FormSelect
              name="paymentType"
              form={form}
              id="paymentType"
              label="Type of expense"
              options={[
                { value: "CASH", title: "CASH" },
                { value: "UPI", title: "UPI" },
                { value: "CARD", title: "CARD" },
              ]}
            />

            <div className="flex gap-3 justify-around">
              <Button
                type="submit"
                className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
                disabled={mutationLoading}
                isLoading={mutationLoading}
              >
                Submit
              </Button>

              <DialogClose asChild>
                <Button
                  ref={cancelRef}
                  className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddTenantPay;
