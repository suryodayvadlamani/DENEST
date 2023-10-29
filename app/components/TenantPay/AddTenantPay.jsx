"use client";

import React, { useRef } from "react";
import { createTenantPayFn } from "@/app/helpers/tenantpay";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUsersFn } from "@/app/helpers/user";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@UI/button";
import { useToast } from "@UI/use-toast";
import FormInput from "@components/Form/FormInput";
import FormCalendar from "@components/Form/FormCalendar";
import FormSelect from "@components/Form/FormSelect";
import { Form } from "@UI/form";

import { tenantPayModel } from "@/prisma/zod";
import { DialogClose } from "@radix-ui/react-dialog";
const AddTenantPay = () => {
  const cancelRef = useRef(null);
  const tenantPaySchema = tenantPayModel.omit({ id: true });
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

  const {
    formState: { errors },
  } = form;
  console.log(errors);
  const { isLoading, data: userData, isError, error } = getUsersFn();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: postTenantPay, isLoading: mutationLoading } =
    createTenantPayFn(cancelRef);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      postTenantPay(data);
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <FormSelect
              name="userId"
              form={form}
              id="userId"
              label="Tenant"
              options={userData?.data?.map((user) => {
                return { value: user.id, title: user.name };
              })}
            />

            <FormInput
              className="mb-3"
              name="amount"
              form={form}
              id="expenseAmount"
              type="number"
              label="Amount"
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
