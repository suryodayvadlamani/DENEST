"use server";

import { GET_HOSTELS } from "@/app/lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";

export async function createRoom(formData) {
  try {
    await nextFetch("api/manageRoom", "", "POST", formData);
    revalidateTag(GET_HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
