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
  if (!["OWNER", "MANAGER"].includes(session.role))
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 }
    );

  const { title, isActive, occupied, roomId } = await request.json();
  try {
    await prisma.bed.create({
      data: {
        title,
        isActive,
        occupied,
        roomId,
      },
    });

    return NextResponse.json({ message: "Bed Registered" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
