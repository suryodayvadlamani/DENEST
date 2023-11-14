import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { validateRole } from "app/helpers/validateRole";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  const {
    name,
    floors,
    addressLine1,
    addressLine2,
    pincode,
    district,
    state,
    country,
    contact,
  } = await request.json();

  try {
    await prisma.hostel.create({
      data: {
        name,
        floors,
        addressLine1,
        addressLine2,
        pincode,
        district,
        state,
        country,
        contact,
        vendorId: session.user.vendorId,
      },
    });
    return NextResponse.json({ message: "Room Created" }, { status: 201 });
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

  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let whereClause = {};
    switch (session.role) {
      case "OWNER":
        whereClause = { vendorId: session.user.vendorId };
        break;
      case "MANAGER":
        whereClause = { id: session.user.hostelId };
        break;
      default:
        break;
    }

    let hostelInfo = await prisma.hostel.findMany({
      where: { ...whereClause },
      select: {
        id: true,
        name: true,
        floors: true,
        addressLine1: true,
        addressLine2: true,
        pincode: true,
        district: true,
        state: true,
        country: true,
        contact: true,
        UserRoles: {
          select: {
            userId: true,
          },
        },
        Rooms: {
          select: {
            Beds: {
              select: {
                occupied: true,
              },
            },
          },
        },
      },
    });

    let finalData = [];
    for (const hostel of hostelInfo) {
      const userIds = hostel.UserRoles.map((ur) => ur.userId);
      let filterData = {
        startDate: {
          gte: startDate,
        },
      };
      if (endDate) {
        filterData = {
          ...filterData,
          endDate: {
            lte: endDate,
          },
        };
      }
      const rentData = await prisma.tenantRoom.aggregate({
        where: {
          AND: [
            { userId: { in: userIds } },
            {
              OR: [
                { isActive: true },
                {
                  endDate: {
                    gt: startDate,
                  },
                },
              ],
            },
          ],
        },
        _sum: {
          rent: true,
        },
      });
      const collectedData = await prisma.tenantPay.aggregate({
        where: filterData,
        _sum: {
          amount: true,
        },
      });

      finalData.push({
        ...hostel,
        rentData: rentData._sum.rent,
        collectedData: collectedData._sum.amount,
      });
    }

    return NextResponse.json(finalData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
