"use server";
import { INCOME } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getDayIncome() {
  try {
    const response = await nextFetch("/api/manageDayIncome", [INCOME, "true"]);

    return { isError: false, data: response };
  } catch (e) {
    console.log({ e });
    return { isError: true, data: "Failed to read" };
  }
}
