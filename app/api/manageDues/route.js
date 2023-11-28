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

  let whereClause = {};
  switch (session.role) {
    case "OWNER":
      whereClause = { vendorId: session.user.vendorId };
      break;
    case "MANAGER":
      whereClause = { hostelId: session.user.hostelId };
      break;
  }

  try {
    let resp = await prisma.userRoles.findMany({
      where: { ...whereClause },
    });

    const userIds = resp.map((ur) => ur.userId);

    resp = await prisma.tenantRoom.findMany({
      where: { AND: [{ isActive: true }, { userId: { in: userIds } }] },
      select: {
        userId: true,
        rent: true,
      },
    });
    resp.forEach(async (user) => {
      await prisma.dues.upsert({
        where: { userId: user.userId },
        update: {
          amount: {
            increment: user.rent,
          },
        },
        create: {
          userId: user.userId,
          amount: user.rent,
          createdBy: "System",
        },
      });
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
      include: {
        hostel: true,
        user: true,
      },
    });
    const userIds = resp.map((ur) => ur.userId);
    const RoomsDetails = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        bed: {
          select: {
            room: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    let dueData = await prisma.dues.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        amount: true,
      },
      orderBy: {
        amount: "desc",
      },
    });
    dueData = dueData.map((x) => {
      const ur = resp.filter((y) => y.userId == x.userId)[0];
      const roomDetails = RoomsDetails.filter((y) => y.userId == x.userId)[0];
      return {
        amount: x.amount,
        contact: ur.user.contact,
        roomName: roomDetails.bed.room.title,
        userName: ur.user.name,
        hostelName: ur.hostel.name,
      };
    });
    return NextResponse.json(dueData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
