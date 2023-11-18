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
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const session = await getServerSession(authOptions);

  const { id, ...request_data } = await request.json();
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: { ...request_data },
    });

    if (request_data.isActive) {
      const ur = await findRole(
        {
          AND: {
            userId: { equals: id },
            isActive: { equals: false },
          },
        },
        {
          orderBy: {
            expired: "desc",
          },
        }
      );
      await prisma.userRoles.update({
        where: {
          AND: {
            id: { equals: ur[0].id },
            isActive: { equals: true },
          },
        },
        data: {
          isActive: true,
          expired: null,
        },
      });
    } else {
      const ur = await findRole({
        AND: {
          userId: { equals: id },
          isActive: { equals: true },
        },
      });
      await prisma.userRoles.update({
        where: { id: ur[0].id },
        data: {
          isActive: false,
          expired: new Date(),
        },
      });
    }

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
          include: {
            user: true,
            hostel: true,
            role: true,
          },
          where: { isActive: isActive },
        };
        break;
      case "OWNER":
        options = {
          ...options,
          where: {
            AND: [
              { isActive: isActive },
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
            AND: [
              { isActive: isActive },
              { hostelId: session.user.hostelId },
              { roleId: TENANT },
            ],
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
          AND: [
            { ...options.where },
            { isActive: isActive },
            { roleId: TENANT },
          ],
        },
      };
    }

    const totalRows = await prisma.userRoles.count({
      where: options.where,
    });

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

    const resp = await prisma.userRoles.findMany(options);

    const usersOccupied = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: resp.map((ur) => ur.user.id) },
      },
      select: {
        userId: true,
        bedId: true,
        rent: true,
      },
    });
    const bedIds = usersOccupied.map((x) => x.bedId);
    const RoomData = await prisma.Bed.findMany({
      where: {
        id: { in: bedIds },
      },
      select: {
        id: true,
        room: {
          select: {
            title: true,
          },
        },
      },
    });
    const flatRoomData = {};
    RoomData.map((x) => {
      flatRoomData[x.id] = x.room.title;
      return x;
    });

    return NextResponse.json(
      {
        data: resp.map((ur) => ({
          ...ur.user,
          roomName:
            flatRoomData[
              usersOccupied.filter((x) => x.userId == ur.user.id)[0]?.bedId
            ],
          assigned: usersOccupied.map((x) => x.userId).includes(ur.user.id),
          rent: usersOccupied.filter((x) => x.userId == ur.user.id)[0]?.rent,
          role: ur.role.name,
          hostel: ur.hostel?.name,
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
