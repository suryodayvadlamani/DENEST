"use server";
import { INCOME } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getDayIncome(date) {
  try {
    let url = `api/manageDayIncome?`;
    if (date.startDate) url = url + `&&startDate=${date.startDate}`;
    if (date.endDate) url = url + `&&endDate=${date.endDate}`;
    const response = await nextFetch(url, [INCOME, { ...date }]);

    return { isError: false, data: response };
  } catch (e) {
    console.log({ e });
    return { isError: true, data: "Failed to read" };
  }
}
