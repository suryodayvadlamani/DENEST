"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { validateRole } from "app/helpers/validateRole";

export async function getVendors() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "You don't have permission!" };
  if (session.role !== "ADMIN" && session.role !== "OWNER")
    return { error: "You are not authorized" };
  try {
    const {
      nextUrl: { search },
    } = request;
    const { isActive } = new URLSearchParams(search);

    const whereClause = isActive ? { isActive: true } : {};

    const resp = await prisma.vendor.findMany({
      where: whereClause,
    });

    return { data: resp };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}

export async function getVendorById({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "You don't have permission!" };
  if (session.role !== "ADMIN" && session.role !== "OWNER")
    return { error: "You are not authorized" };

  try {
    const {
      nextUrl: { search },
    } = request;
    const { isActive } = new URLSearchParams(search);
    const { id } = params;
    const whereClause = isActive ? { id, isActive: true } : { id };

    const resp = await prisma.vendor.findMany({
      where: whereClause,
    });

    return { data: resp[0] };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}
