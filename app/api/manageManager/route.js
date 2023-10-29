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
if (session.user.role != "owner")
  return NextResponse.json(
    { message: "You are not authorized" },
    { status: 403 }
  );

  const {
    name,
    email,
    aadhar,
    
    addressLine1,
    addressLine2,
    pincode,
    district,
    state,
    country,
    contact
    
  } = await request.json();
  try {
    const data = await prisma.user.create({
      data: {
        name,
        email,
        aadhar,
        
        addressLine1,
        addressLine2,
        pincode,
        district,
        state,
        country,
        contact,
      },
    });

    return NextResponse.json({ message: "Manager Registered" }, { status: 201 });
  }catch (err) {
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
  
}
