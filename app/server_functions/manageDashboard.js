"use server";
import { DASHBOARD } from "@lib/Query_Keys";
import nextFetch from "@lib/nextFetch";

export async function getDashboard() {
  try {
    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString();

    const response = await nextFetch(
      `api/manageDashboard?startDate=${startDate}&&endDate=${today.toISOString()}`,
      [DASHBOARD]
    );

    return { isError: false, data: response };
  } catch (e) {
    console.log(e);
    return { isError: true, data: "Failed to read" };
  }
}
