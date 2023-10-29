import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";

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
  if (session.role != "ADMIN")
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const {
    name,
    GSTIN,
    addressLine1,
    addressLine2,
    pincode,
    district,
    state,
    country,
    contact,
    email,
    isActive,
  } = await request.json();
  try {
    const data = await prisma.vendor.create({
      data: {
        name,
        GSTIN,
        addressLine1,
        addressLine2,
        pincode,
        district,
        state,
        country,
        contact,
        email,
        isActive,
      },
    });

    return NextResponse.json({ message: "Vendor Registered" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
  if (session.role != "ADMIN")
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const { id, ...request_data } = await request.json();
  try {
    await prisma.vendor.update({
      where: {
        id: id,
      },
      data: { ...request_data },
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
  if (session.role !== "ADMIN" && session.role !== "OWNER")
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );
  try {
    const {
      nextUrl: { search },
    } = request;
    const { isActive } = new URLSearchParams(search);

    const whereClause = isActive ? { isActive: true } : {};

    const resp = await prisma.vendor.findMany({
      where: whereClause,
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
