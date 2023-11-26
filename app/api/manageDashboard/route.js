import { getServerSession } from "next-auth";
import { differenceInMonths, parseISO } from "date-fns";
import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";
import { validateRole } from "@/app/helpers/validateRole";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  console.log({ startDate, endDate });
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

    let filterData = {
      userId: { in: userIds },
      startDate: {
        gte: startDate,
      },
    };

    const rentData = await prisma.tenantRoom.findMany({
      where: filterData,
    });

    let totalRent = 0;
    rentData.map((x) => {
      if (x.isActive) {
        totalRent +=
          differenceInMonths(new Date(endDate), new Date(x.startDate)) * x.rent;
      } else {
        totalRent +=
          differenceInMonths(new Date(x.endDate), new Date(x.startDate)) *
          x.rent;
      }
    });

    const dailyTotal = await prisma.income.aggregate({
      where: {
        hostelId: { in: hostelIds },
        AND: [
          {
            createdDate: {
              gte: startDate,
            },
          },
          {
            createdDate: {
              lte: endDate,
            },
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });
    totalRent += dailyTotal._sum.amount;
    const expenseData = await prisma.expense.aggregate({
      where: {
        hostelId: { in: hostelIds },
        AND: [
          {
            expenseDate: {
              gte: startDate,
            },
          },
          {
            expenseDate: {
              lte: endDate,
            },
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });
    const inr = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    });
    return NextResponse.json(
      {
        totalRent: inr.format(totalRent),
        totalExpense: inr.format(expenseData._sum.amount),
      },
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
