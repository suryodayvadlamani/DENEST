import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { limiter } from "../../config/limiter";
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
      },
    });

    return NextResponse.json({ message: "Tenant Registered" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const { id, ...request_data } = await request.json();
  try {
    const { id } = params;
    await prisma.user.update({
      where: {
        id: id,
      },
      data: { ...request_data },
    });

    return NextResponse.json({ message: "Tenant Registered" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
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
    const { isActive } = new URLSearchParams(search);
    const { id } = params;
    const whereClause = isActive ? { id, isActive: true } : { id };

    const resp = await prisma.user.findMany({
      orderBy: [
        {
          isActive: "desc",
        },
      ],
      where: whereClause,
    });

    return NextResponse.json(resp[0], { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
