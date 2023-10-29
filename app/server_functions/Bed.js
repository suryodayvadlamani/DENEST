"use server";

import { GET_HOSTELS } from "@/app/lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";

export async function createBed(formData) {
  try {
    await nextFetch("api/manageBed", "", "POST", formData);
    revalidateTag(GET_HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
export async function deleteBed(formData) {
  try {
    await nextFetch(`/api/manageBed/${formData.id}`, "", "DELETE", formData);
    revalidateTag(GET_HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
