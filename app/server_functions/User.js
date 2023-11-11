"use server";
import { USERS } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";

export async function getUsers() {
  try {
    const response = await nextFetch("/api/manageTenant", [USERS]);
    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
export async function deleteUser(data) {
  try {
    const response = await nextFetch("/api/manageTenant", "", "PUT", data);
    revalidateTag(USERS);
    return { isError: false, data: response };
  } catch (e) {
    console.log("what error", e);
    return { isError: true, data: "Failed to read" };
  }
}
