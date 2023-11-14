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

  const { title, capacity, roomType, floorId, isActive, hostelId } =
    await request.json();
  try {
    await prisma.room.create({
      data: {
        title,
        capacity,
        roomType,
        floorId,
        hostelId: hostelId || session.user.hostelId,
        isActive,
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
