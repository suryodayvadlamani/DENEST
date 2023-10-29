"use server";
import { USERS } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";

export async function getUsers() {
  try {
    const response = await nextFetch("/api/manageTenant", [USERS]);
    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
