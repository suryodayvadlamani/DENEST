import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { validateRole } from "@/app/helpers/validateRole";

export async function GET(request, { params }) {
  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  try {
    const { id } = params;

    const resp = await prisma.room.findMany({
      where: { id },
      include: {
        Beds: true,
      },
    });
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
