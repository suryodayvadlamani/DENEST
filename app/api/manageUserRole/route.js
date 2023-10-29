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
  if (
    session.role != "ADMIN" &&
    session.role != "MANAGER" &&
    session.role != "OWNER"
  )
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const { userEmail, roleId, isActive, vendorId, hostelId, roleName } =
    await request.json();

  const userData = await prisma.user.findMany({ where: { email: userEmail } });
  let data = {};
  switch (roleName) {
    case "ADMIN":
      data = {
        userId: userData[0].id,
        roleId,
        isActive,
        created: new Date(),
      };
      if (session.user.roleId != roleId) data = { ...data, vendorId };
      break;
    case "OWNER":
      data = {
        userId: userData[0].id,
        roleId,
        isActive,
        vendorId,
        created: new Date(),
      };
      break;
    case "MANAGER":
      data = {
        userId: userData[0].id,
        roleId,
        isActive,
        vendorId,
        hostelId,
        created: new Date(),
      };
      break;
  }
  const res = await createRole(data);

  if (res == 201)
    return NextResponse.json({ message: "Hostel Registered" }, { status: 201 });
  else
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: res }
    );
}

export async function createRole(data) {
  try {
    await prisma.userRoles.create({
      data,
    });
    return 201;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

export async function findRole() {
  try {
    await prisma.userRoles.findMany({
      where: {
        AND: {
          userId: { equals: userId },
          isActive: { equals: isActive },
        },
      },
    });
    return 200;
  } catch (err) {
    return 500;
  }
}
