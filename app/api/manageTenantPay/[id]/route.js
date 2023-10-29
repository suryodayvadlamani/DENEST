import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { limiter } from "../../config/limiter";

export async function DELETE(request) {
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
      { message: "You don't have permission!" },
      { status: 401 }
    );
  if (
    session.role != "ADMIN" &&
    session.role != "OWNER" &&
    session.role != "MANAGER"
  )
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 403 }
    );

  const { id } = await request.json();

  try {
    await prisma.tenantPay.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Tenant Payment Deleted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
