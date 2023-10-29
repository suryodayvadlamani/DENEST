"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MANAGER, TENANT } from "@lib/roleId";

import { validateRole } from "app/helpers/validateRole";

export async function getUsers() {
  const session = await getServerSession(authOptions);

  const res = await validateRole();
  if (res?.error) return { error };
  try {
    const {
      nextUrl: { search },
    } = request;
    const paramData = new URLSearchParams(search);
    const isTenant = paramData.get("isTenant");
    let options = {};
    switch (session.role) {
      case "ADMIN":
        options = {
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      case "OWNER":
        options = {
          where: {
            AND: [
              { vendorId: session.user.vendorId },
              {
                OR: [{ roleId: TENANT }, { roleId: MANAGER }],
              },
            ],
          },
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      case "MANAGER":
        options = {
          where: {
            AND: [{ hostelId: session.user.hostelId }, { roleId: TENANT }],
          },
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      default:
        break;
    }
    if (isTenant == "true") {
      options = {
        ...options,
        where: {
          AND: [{ ...options.where }, { roleId: TENANT }],
        },
      };
    }

    const resp = await prisma.userRoles.findMany(options);

    const usersOccupied = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: resp.map((ur) => ur.user.id) },
      },
      select: {
        userId: true,
        rent: true,
      },
    });

    const usersData = resp.map((ur) => ({
      ...ur.user,
      assigned: usersOccupied.map((x) => x.userId).includes(ur.user.id),
      rent: usersOccupied.filter((x) => x.userId == ur.user.id)[0]?.rent,
      role: ur.role.name,
      hostel: ur.hostel.name,
    }));

    return { data: usersData };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}

export async function getUsersById({ params }) {
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

    const resp = await prisma.user.findMany({
      where: whereClause,
    });

    return { data: resp[0] };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}
