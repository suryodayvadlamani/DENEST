"use server";
import { EXPENSES } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";

export async function getExpense() {
  try {
    const response = await nextFetch("/api/manageExpense", [EXPENSES]);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
