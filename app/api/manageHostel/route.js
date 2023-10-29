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
    return NextResponse.json({ message: "Hostel Registered" }, { status: 201 });
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

  const origin = request.headers.get("origin");
  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  try {
    let whereClause = {};
    if (session.role !== "ADMIN") {
      whereClause = { vendorId: session.user.vendorId };
    }

    let resp = await prisma.hostel.findMany({
      where: { ...whereClause },
      include: {
        Rooms: {
          include: {
            Beds: true,
          },
        },
      },
    });
    if (session.role === "MANAGER") {
      resp = resp.filter((hostel) => hostel.id === session.user.hostelId);
    }

    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
