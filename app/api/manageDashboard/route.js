import { getServerSession } from "next-auth";

import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";

export async function GET(request) {
  const origin = request.headers.get("origin");
  const remaining = await limiter.removeTokens(1);
  if (remaining < 0) {
    return NextResponse.json(
      { message: "Too many requests" },
      { status: 429 },
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
        },
      }
    );
  }
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "You don't have persmision!" },
      { status: 401 }
    );
  if (
    session.role !== "ADMIN" &&
    session.role !== "OWNER" &&
    session.role !== "MANAGER"
  )
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );
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

    return NextResponse.json(
      { rentData, paidData, expenseData },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
