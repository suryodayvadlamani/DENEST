import { getServerSession } from "next-auth";

import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";
import { validateRole } from "@/app/helpers/validateRole";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json(
      { message: "You don't have permission!" },
      { status: 401 }
    );
  if (!["OWNER", "ADMIN"].includes(session.role))
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 }
    );

  const post_data = await request.json();

  const { amount, expenseType, description, expenseDate, hostelId } = post_data;
  try {
    await prisma.expense.create({
      data: {
        amount,
        expenseType,
        description,
        expenseDate,
        hostelId: hostelId || session.user.hostelId,
      },
    });

    return NextResponse.json({ message: "Expense Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const session = await getServerSession(authOptions);

  try {
    const {
      nextUrl: { search },
    } = request;

    const paramData = new URLSearchParams(search);

    const expenseType = paramData.get("expenseType");
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    console.log({ startDate, endDate }, "ghj");
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
    const hostelIds = resp.map((ur) => ur.hostelId).filter((x) => x != null);
    let timeFilter = {};
    const chck = [null, "undefined"];
    if (!chck.includes(startDate) && !chck.includes(endDate)) {
      console.log({ startDate, endDate });
      timeFilter = {
        AND: [
          {
            expenseDate: {
              lte: endDate,
            },
          },
          {
            expenseDate: {
              gte: startDate,
            },
          },
        ],
      };
    } else if (!chck.includes(endDate)) {
      timeFilter = {
        expenseDate: {
          lte: endDate,
        },
      };
    } else if (!chck.includes(startDate)) {
      timeFilter = {
        expenseDate: {
          gte: startDate,
        },
      };
    }
    if (expenseType && expenseType != "All") {
      resp = await prisma.expense.findMany({
        where: {
          AND: [
            { hostelId: { in: hostelIds } },
            { expenseType: expenseType },
            timeFilter,
          ],
        },
      });
    } else {
      resp = await prisma.expense.groupBy({
        by: ["expenseType"],
        _sum: {
          amount: true,
        },
        where: {
          AND: [{ hostelId: { in: hostelIds } }, timeFilter],
        },
      });
    }
    console.log(resp);
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
