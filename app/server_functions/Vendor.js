"use server";
import { VENDORS } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { useStore } from "../store/store";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getVendors() {
  try {
    const response = await nextFetch("/api/manageVendor", [VENDORS]);
    useStore.setState(() => ({
      vendors: response,
    }));
    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
export async function updateVendor(id, data) {
  try {
    await nextFetch(`api/manageVendor/${id}`, [], "PUT", data);
    revalidateTag(VENDORS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}

export async function getVendorById(id) {
  try {
    const response = await nextFetch(`/api/manageVendor/${id}`, []);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}

export async function deleteVendor(data) {
  try {
    const response = await nextFetch("/api/manageVendor", "", "PUT", data);
    revalidateTag(VENDORS);
    return { isError: false, data: response };
  } catch (e) {
    console.log("what error", e);
    return { isError: true, data: "Failed to read" };
  }
}
export async function createVendor(data) {
  try {
    const response = await nextFetch("/api/manageVendor", "", "POST", data);
    revalidateTag(VENDORS);
    return { isError: false, data: response };
  } catch (e) {
    console.log("what error", e);
    return { isError: true, data: "Failed to read" };
  }
}
