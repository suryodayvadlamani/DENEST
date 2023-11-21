import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { validateRole } from "@/app/helpers/validateRole";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  const d = await request.json();

  const { rent, advance, tenantContact, bedId } = d;

  try {
    const userId = await prisma.user.findMany({
      where: {
        contact: tenantContact,
      },
    });

    const userTenantRoom = await prisma.tenantRoom.findMany({
      where: {
        AND: [{ userId: userId[0].id }, { isActive: true }],
      },
    });

    if (userTenantRoom.length > 0) {
      await prisma.tenantRoom.updateMany({
        where: {
          AND: [{ userId: userId[0].id }, { isActive: true }],
        },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      });

      await prisma.bed.update({
        where: {
          id: userTenantRoom[0].bedId,
        },
        data: {
          occupied: false,
        },
      });
    }

    const s = await prisma.tenantRoom.create({
      data: {
        rent,
        advance,
        userId: userId[0].id,
        bedId,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });

    await prisma.bed.update({
      where: {
        id: bedId,
      },
      data: {
        occupied: true,
      },
    });

    return NextResponse.json({ message: "Room Registered" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
