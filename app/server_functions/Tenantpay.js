"use server";
import { TENANT_PAY } from "@lib/Query_Keys";
import nextFetch from "@/app/lib/nextFetch";

export async function getTenantPay() {
  try {
    const response = await nextFetch("/api/manageTenantPay", [TENANT_PAY]);

    return { isError: false, data: response };
  } catch (e) {
    return { isError: true, data: "Failed to read" };
  }
}
