import React, { useRef } from "react";

import { Button } from "@UI/button";

import FormInput from "@components/Form/FormInput";
import FormCalendar from "@components/Form/FormCalendar";
import FormSelect from "@components/Form/FormSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseModel } from "@/prisma/zod";
import { Form } from "@UI/form";
import { createExpenseFn } from "@/app/helpers/expense";
import { getHostelsFn } from "@/app/helpers/hostel";
import { DialogClose } from "@radix-ui/react-dialog";
function AddExpense({ hostelsData }) {
  const expenseSchema = expenseModel.omit({ id: true });
  const cancelRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      expenseType: "",
      description: "",
      expenseDate: "",
      hostelId: "",
    },
  });

  const { mutate: postExpense, isLoading: mutationLoading } =
    createExpenseFn(cancelRef);
  const onSubmit = async (data) => {
    try {
      postExpense(data);
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  return (
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
          options={hostelsData?.map((hostel) => {
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
  );
}

export default AddExpense;
