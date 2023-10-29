import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { limiter } from "../../config/limiter";

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
    if (session.role !== "ADMIN") {
      whereClause = { vendorId: session.user.vendorId };
    }

    let resp = await prisma.userRoles.findMany({
      where: { ...whereClause },
    });
    console.log(resp);
    if (session.role === "MANAGER") {
      resp = resp.filter(
        (userRole) => userRole.hostelId === session.user.hostelId
      );
    }
    const userIds = resp.map((ur) => ur.userId);

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
      },
    });
    rentData = rentData.map((ren) => {
      const amount = paidData.filter((x) => x.userId == ren.userId);
      const hostelId = resp.filter((x) => x.userId == ren.userId)[0]?.hostelId;
      return {
        ...ren,
        amount: amount.length > 0 ? amount[0].amount : 0,
        hostelId,
      };
    });

    return NextResponse.json(rentData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
