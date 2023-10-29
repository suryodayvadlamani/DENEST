import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

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

  const d = await request.json();

  const { rent, advance, userId, bedId } = d;
  try {
    const userTenantRoom = await prisma.tenantRoom.findMany({
      where: {
        AND: [{ userId }, { isActive: true }],
      },
    });
    await prisma.tenantRoom.updateMany({
      where: {
        AND: [{ userId }, { isActive: true }],
      },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });
    userTenantRoom.forEach(async (utr) => {
      await prisma.bed.update({
        where: {
          id: utr.bedId,
        },
        data: {
          occupied: false,
        },
      });
    });

    await prisma.tenantRoom.create({
      data: {
        rent,
        advance,
        userId,
        bedId,
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
