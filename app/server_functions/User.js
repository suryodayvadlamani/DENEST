"use server";
import { USERS } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getUsers() {
  try {
    const response = await nextFetch("/api/manageTenant", [USERS, "true"]);

    return { isError: false, data: response };
  } catch (e) {
    console.log({ e });
    return { isError: true, data: "Failed to read" };
  }
}
export async function deleteUser(data) {
  try {
    const response = await nextFetch("/api/manageTenant", "", "PUT", data);
    revalidateTag([USERS, "false"]);
    redirect(`userManagment?activeTab=inactive`);
    return { isError: false, data: response };
  } catch (e) {
    console.log("what error", e);
    return { isError: true, data: "Failed to read" };
  }
}

export async function getUserById(id) {
  try {
    const response = await nextFetch(`/api/manageTenant/${id}`, []);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}

export async function updateUser(id, data) {
  try {
    await nextFetch(`api/manageTenant/${id}`, [], "PUT", data);
    revalidateTag(USERS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
