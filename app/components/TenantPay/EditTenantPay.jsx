"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tenantPayModel } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@UI/button";
import { Form } from "@UI/form";
import {
  getTenantPayByIdFn,
  updateTenantPayIdFn,
} from "@/app/helpers/tenantpay";
import FormInput from "@components/Form/FormInput";
import FormCalendar from "@components/Form/FormCalendar";
import FormSelect from "@components/Form/FormSelect";

const EditTenantPay = () => {
  const tenantPaySchema = tenantPayModel.omit({ id: true });
  const searchParams = useSearchParams();
  const tenantPayId = searchParams.get("id");

  const { data: tenantPayData } = getTenantPayByIdFn(tenantPayId);

  const { mutate: updateTenantPay, isLoading: mutationLoading } =
    updateTenantPayIdFn();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(tenantPaySchema),
    defaultValues: {
      userId: "",
      amount: 0,
      paymentType: "",
      startDate: new Date(),
      endDate: new Date(),
      paidDate: new Date(),
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (tenantPayData?.data) {
      reset({
        userId: tenantPayData.data.userId,
        amount: tenantPayData.data.amount,
        paymentType: tenantPayData.data.paymentType,
        startDate: new Date(tenantPayData.data.startDate),
        endDate: new Date(tenantPayData.data.endDate),
        paidDate: new Date(tenantPayData.data.paidDate),
      });
    }
  }, [tenantPayData?.data]);

  const goBack = (e) => {
    e.preventDefault();
    router.replace("/hostels/tenantpay", { scroll: false });
    //router.back();
  };

  const onSubmit = async (formData) => {
    await updateTenantPay({ id: tenantPayId, data: { ...formData } });
    router.replace("/hostels/tenantpay");
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
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
                className="flex  justify-center gap-2"
                disabled={mutationLoading}
                isLoading={mutationLoading}
              >
                Submit
              </Button>

              <Button
                onClick={(e) => goBack(e)}
                className="flex  justify-center gap-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditTenantPay;
