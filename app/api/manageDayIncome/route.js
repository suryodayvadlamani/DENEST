import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createRole, findRole } from "@/app/api/manageUserRole/route";
import { MANAGER, TENANT } from "@lib/roleId";
import { validateRole } from "@/app/helpers/validateRole";

export async function POST(request) {
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const session = await getServerSession(authOptions);

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
    amount,
    days,
  } = await request.json();
  try {
    const data = await prisma.income.create({
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
        hostelId,
        createdDate: new Date(),
        amount,
        days,
      },
    });
    console.log(hostelId);
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

    const isActive = paramData.get("isActive") == "true";
    const isTenant = paramData.get("isTenant");
    const take = parseInt(paramData.get("take")) || 10;
    const lastCursor = paramData.get("lastCursor") || undefined;

    let options = {};

    switch (session.role) {
      case "ADMIN":
        options = {
          ...options,
          where: { isActive: isActive },
          select: {
            id: true,
            name: true,
            amount: true,
            contact: true,
            hostel: {
              select: {
                name: true,
              },
            },
          },
        };
        break;
      case "OWNER":
        const hostelIDs = await prisma.hostel.findMany({
          where: { vendorId: session.user.vendorId },
          select: {
            id: true,
          },
        });

        options = {
          ...options,
          where: {
            hostelId: {
              in: hostelIDs.map((x) => x.id),
            },
          },
          select: {
            id: true,
            name: true,
            amount: true,
            contact: true,
            hostel: {
              select: {
                name: true,
              },
            },
          },
        };
        break;
      case "MANAGER":
        options = {
          ...options,
          where: { hostelId: session.user.hostelId },
          select: {
            id: true,
            name: true,
            amount: true,
            contact: true,
            hostel: {
              select: {
                name: true,
              },
            },
          },
        };
        break;
      default:
        break;
    }

    options = {
      ...options,
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

    const resp = await prisma.income.findMany(options);

    return NextResponse.json(
      {
        data: resp,
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
