"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { validateRole } from "app/helpers/validateRole";

export async function getDashboard() {
  const session = await getServerSession(authOptions);

  const res = await validateRole();
  if (res?.error) return { error };
  try {
    let whereClause = {};
    switch (session.role) {
      case "OWNER":
        whereClause = { vendorId: session.user.vendorId };
        break;
      case "MANAGER":
        whereClause = { hostelId: session.user.hostelId };
        break;
    }

    let resp = await prisma.userRoles.findMany({
      where: { ...whereClause },
    });

    const userIds = resp.map((ur) => ur.userId);
    const hostelIds = resp.map((ur) => ur.hostelId).filter((x) => x != null);

    let rentData = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        rent: true,
      },
    });

    const paidData = await prisma.tenantPay.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        amount: true,
        paidDate: true,
      },
    });
    const expenseData = await prisma.expense.findMany({
      where: {
        hostelId: { in: hostelIds },
      },
      select: {
        hostelId: true,
        amount: true,
        expenseDate: true,
        expenseType: true,
      },
    });

    return { rentData: rentData, paidData: paidData, expenseData: expenseData };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}
