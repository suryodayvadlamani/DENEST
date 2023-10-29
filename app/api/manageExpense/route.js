import { getServerSession } from "next-auth";

import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";

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
    const {
      nextUrl: { search },
    } = request;
    const { isActive } = new URLSearchParams(search);
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
    resp = await prisma.expense.findMany({
      where: {
        hostelId: { in: hostelIds },
      },
      include: {
        hostel: true,
      },
    });

    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
