import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { limiter } from "../../config/limiter";
import { validateRole } from "@/app/helpers/validateRole";

export async function POST(request) {
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
  if (session.role != "OWNER" && session.role != "ADMIN")
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const post_data = await request.json();

  const { amount, paymentType, startDate, endDate, userId, paidDate } =
    post_data;
  try {
    await prisma.tenantPay.create({
      data: {
        amount,
        paymentType,
        startDate,
        endDate,
        paidDate,
        userId: userId || session.user.userId,
      },
    });
    await prisma.dues.upsert({
      where: { userId: userId },
      update: {
        amount: {
          increment: -1 * amount,
        },
      },
      create: {
        userId: userId,
        amount: -1 * amount,
        createdBy: "System",
      },
    });
    return NextResponse.json({ message: "TenantPay Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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
      { message: "You don't have permission!" },
      { status: 401 }
    );
  if (
    session.role != "ADMIN" &&
    session.role != "OWNER" &&
    session.role != "MANAGER"
  )
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const { id } = await request.json();

  try {
    await prisma.tenantPay.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Tenant Payment Deleted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
