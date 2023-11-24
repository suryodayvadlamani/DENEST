"use server";
import { EXPENSES } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";

export async function getExpense() {
  try {
    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString();

    const response = await nextFetch(
      `/api/manageExpense?startDate=${startDate}&&endDate=${today.toISOString()}`,
      [EXPENSES, "All"]
    );

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
