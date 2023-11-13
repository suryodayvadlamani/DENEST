import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";
import { createRole } from "@/app/api/manageUserRole/route";
import { MANAGER, TENANT } from "@lib/roleId";
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

  const {
    name,
    email,
    aadhar,
    profession,
    addressLine1,
    addressLine2,
    pincode,
    district,
    state,
    country,
    contact,
    isActive,
    hostelId,
  } = await request.json();
  try {
    const data = await prisma.user.create({
      data: {
        name,
        email,
        aadhar,
        profession,
        addressLine1,
        addressLine2,
        pincode,
        district,
        state,
        country,
        contact,
        isActive,
        createdDate: new Date(),
      },
    });

    const urData = {
      userId: data.id,
      roleId: TENANT,
      isActive: true,
      vendorId: session.user.vendorId,
      hostelId: hostelId,
      created: new Date(),
    };

    const res = await createRole(urData);
    return NextResponse.json({ message: "Tenant Registered" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
  if (session.role != "ADMIN")
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const { id, ...request_data } = await request.json();
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: { ...request_data },
    });

    return NextResponse.json({ message: "Tenant deleted" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  console.log("Please dont call me");
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
    const take = paramData.get("take");
    const lastCursor = paramData.get("lastCursor");
    let options = {
      take: take ? parseInt(take) : 30,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        user: {
          isActive: "asc",
        },
      },
    };

    switch (session.role) {
      case "ADMIN":
        options = {
          ...options,
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      case "OWNER":
        options = {
          ...options,
          where: {
            AND: [
              { vendorId: session.user.vendorId },
              {
                OR: [{ roleId: TENANT }, { roleId: MANAGER }],
              },
            ],
          },
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      case "MANAGER":
        options = {
          ...options,
          where: {
            AND: [{ hostelId: session.user.hostelId }, { roleId: TENANT }],
          },
          include: {
            user: true,
            hostel: true,
            role: true,
          },
        };
        break;
      default:
        break;
    }
    if (isTenant == "true") {
      options = {
        ...options,
        where: {
          AND: [{ ...options.where }, { roleId: TENANT }],
        },
      };
    }

    const resp = await prisma.userRoles.findMany(options);

    const usersOccupied = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: resp.map((ur) => ur.user.id) },
      },
      select: {
        userId: true,
        rent: true,
      },
    });

    return NextResponse.json(
      resp.map((ur) => ({
        ...ur.user,
        assigned: usersOccupied.map((x) => x.userId).includes(ur.user.id),
        rent: usersOccupied.filter((x) => x.userId == ur.user.id)[0]?.rent,
        role: ur.role.name,
        hostel: ur.hostel?.name,
      })),

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
