"use client";

import React from "react";
import { expenseModel } from "@/prisma/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { getExpenseByIdFn, updateExpenseIdFn } from "@/app/helpers/expense";
import { getHostelsFn } from "@/app/helpers/hostel";
import { Form } from "@UI/form";
import FormInput from "@components/Form/FormInput";
import FormCalendar from "@components/Form/FormCalendar";
import FormSelect from "@components/Form/FormSelect";
import { useForm } from "react-hook-form";
import { Button } from "@UI/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const EditExpense = () => {
  const expenseSchema = expenseModel.omit({ id: true });

  const searchParams = useSearchParams();
  const expenseId = searchParams.get("id");

  const { data: expenseData } = getExpenseByIdFn(expenseId);
  const { data } = getHostelsFn();
  const hostelsData = { data: data?.data.finalData };

  const { mutate: updateExpense, isLoading: mutationLoading } =
    updateExpenseIdFn();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      expenseType: "",
      description: "",
      expenseDate: new Date(),
      hostelId: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (expenseData?.data) {
      reset({
        amount: expenseData.data.amount,
        expenseType: expenseData.data.expenseType,
        description: expenseData.data.description,
        expenseDate: new Date(expenseData.data.expenseDate),
        hostelId: expenseData.data.hostelId,
      });
    }
  }, [expenseData?.data]);

  const goBack = (e) => {
    e.preventDefault();
    router.replace("/hostels/expenses", { scroll: false });
    //router.back();
  };

  const onSubmit = async (formData) => {
    console.log(formData);
    await updateExpense({ id: expenseId, data: { ...formData } });
    router.replace("/hostels/expenses");
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            className="mb-3"
            name="amount"
            form={form}
            id="expenseAmount"
            type="number"
            label="Amount"
          />
          <FormSelect
            name="expenseType"
            form={form}
            id="expenseType"
            label="Type of expense"
            options={[
              { value: "UTILITY", title: "UTILITY" },
              { value: "GROCERY", title: "GROCERY" },
              { value: "VEGETABLES", title: "VEGETABLES" },
              { value: "OTHERS", title: "OTHERS" },
            ]}
          />
          <FormSelect
            name="hostelId"
            form={form}
            id="hostelId"
            label="Hostel"
            options={hostelsData?.data?.map((hostel) => {
              return { value: hostel.id, title: hostel.name };
            })}
          />

          <FormInput
            name="description"
            form={form}
            id="description"
            label="Description"
          />
          <FormCalendar name="expenseDate" form={form} label="Expense Date" />

          <div className="flex gap-3 justify-around">
            <Button
              type="submit"
              className="flex  justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  "
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
  );
};

export default EditExpense;
