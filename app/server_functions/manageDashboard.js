"use server";
import { DASHBOARD } from "@lib/Query_Keys";
import nextFetch from "@lib/nextFetch";

export async function getDashboard() {
  try {
    const response = await nextFetch("api/manageDashboard", [DASHBOARD]);

    return { isError: false, data: response };
  } catch (e) {
    console.log(e);
    return { isError: true, data: "Failed to read" };
  }
}
