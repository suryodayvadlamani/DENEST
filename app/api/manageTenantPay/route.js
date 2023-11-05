import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { limiter } from "../config/limiter";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json(
      { message: "You don't have permission!" },
      { status: 401 }
    );
  if (!["OWNER", "ADMIN", "MANAGER"].includes(session.role))
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 }
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
    const resp = await prisma.tenantPay.findMany({
      include: {
        user: {
          include: {
            UserRoom: {
              include: {
                bed: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      resp.map((x) => {
        return {
          ...x,
          advance: x.user.UserRoom[0].advance,
          roomName: x.user.UserRoom[0]?.bed.room.title,
          startDate: x.startDate.toLocaleDateString(),
          endDate: x.endDate.toLocaleDateString(),
          user: x.user.name,
          contact: x.user.contact,
          userId: x.user.id,
        };
      }),
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
