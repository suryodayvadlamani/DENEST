"use server";

import { HOSTELS, DUES } from "@/app/lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { revalidateTag } from "next/cache";

export async function getHostels() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const filters = `startDate=${firstDay.toISOString()}`;

  try {
    const response = await nextFetch(`api/manageHostel?${filters}`, [
      HOSTELS,
      "All",
    ]);

    return { error: false, data: response };
  } catch (e) {
    return { error: true, data: "Failed to read" };
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
      HOSTELS,
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
    revalidateTag(HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
