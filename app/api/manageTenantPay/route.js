import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { validateRole } from "@/app/helpers/validateRole";
import { MANAGER, TENANT } from "@lib/roleId";

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
    const user = await prisma.user.findMany({
      where: {
        contact: userId,
      },
    });
    if (user.length < 0)
      return NextResponse.json(
        { message: "Sorry not a lucky day try again" },
        { status: 500 }
      );
    const userRole = await prisma.userRoles.findMany({
      where: {
        userId: user[0].id,
      },
      select: {
        roleId: true,
      },
    });
    if (userRole[0].roleId !== TENANT)
      if (user.length < 0)
        return NextResponse.json(
          { message: "Sorry not a lucky day try again" },
          { status: 500 }
        );
    await prisma.tenantPay.create({
      data: {
        amount,
        paymentType,
        startDate,
        endDate,
        paidDate,
        userId: user[0].id || session.user.userId,
      },
    });
    await prisma.dues.upsert({
      where: { userId: user[0].id },
      update: {
        amount: {
          increment: -1 * amount,
        },
      },
      create: {
        userId: user[0].id,
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
  const session = await getServerSession(authOptions);

  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  try {
    const {
      nextUrl: { search },
    } = request;
    const paramData = new URLSearchParams(search);

    const isTenant = paramData.get("isTenant");
    const take = parseInt(paramData.get("take")) || 10;
    const lastCursor = paramData.get("lastCursor") || undefined;

    let options = {};
    let whereClause = {};
    switch (session.role) {
      case "ADMIN":
        options = {
          ...options,
        };
        break;
      case "OWNER":
        whereClause = {
          where: {
            AND: [
              { vendorId: session.user.vendorId },
              {
                OR: [{ roleId: TENANT }, { roleId: MANAGER }],
              },
            ],
          },
        };
        break;
      case "MANAGER":
        whereClause = {
          where: {
            AND: [{ hostelId: session.user.hostelId }, { roleId: TENANT }],
          },
        };
        break;
      default:
        break;
    }
    const users = await prisma.userRoles.findMany({
      ...whereClause,
      select: {
        userId: true,
      },
    });

    options = {
      ...options,
      where: {
        userId: { in: users.map((x) => x.userId) },
      },
      take: parseInt(take),
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        id: "asc",
      },
    };

    options = {
      ...options,
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
    };
    const resp = await prisma.tenantPay.findMany(options);

    return NextResponse.json(
      {
        data: resp.map((x) => ({
          ...x,
          advance: x.user.UserRoom[0].advance,
          roomName: x.user.UserRoom[0]?.bed.room.title,
          startDate: x.startDate.toLocaleDateString(),
          endDate: x.endDate.toLocaleDateString(),
          user: x.user.name,
          contact: x.user.contact,
          userId: x.user.id,
        })),
        meta: {
          nextId: resp.length === take ? resp[take - 1].id : undefined,
        },
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
