"use server";

import { HOSTELS } from "@/app/lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";
import { useQueryClient } from "@tanstack/react-query";
import { revalidateTag } from "next/cache";

export async function createBed(formData) {
  try {
    await nextFetch("api/manageBed", "", "POST", formData);
    revalidateTag(HOSTELS);

    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
export async function deleteBed(formData) {
  try {
    await nextFetch(`/api/manageBed/${formData.id}`, "", "DELETE", formData);

    const queryClient = useQueryClient();
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === HOSTELS,
    });
    return { isError: false, data: "success" };
  } catch (e) {
    return { isError: true, data: "Failed to create" };
  }
}
