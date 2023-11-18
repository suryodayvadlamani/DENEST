"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { tenantPayModel } from "@/prisma/zod";
import UserFormLoader from "@components/loaders/UserForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const EditTenantPay = () => {
  const tenantPaySchema = tenantPayModel.omit({ id: true });
  const searchParams = useSearchParams();
  const tenantPayId = searchParams.get("id");

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

  const { formState, reset } = form;
  const { isSubmitting } = formState;

  return <></>;
};

export default EditTenantPay;
