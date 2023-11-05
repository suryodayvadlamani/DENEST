"use server";

import { GET_HOSTELS, DUES } from "@/app/lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";

export async function getHostels() {
  try {
    const response = await nextFetch("api/manageHostel", [GET_HOSTELS]);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
export async function getDefaulters() {
  try {
    const response = await nextFetch("api/manageDues", [DUES]);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
export async function getHostelById({ hostelId }) {
  try {
    const response = await nextFetch(`api/manageHostel/rent/${hostelId}`, [
      GET_HOSTELS,
      hostelId,
    ]);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
export async function createHostel(formData) {
  try {
    await nextFetch("api/manageHostel", "", "POST", formData);
    revalidateTag(GET_HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
