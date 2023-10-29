import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { limiter } from "../../config/limiter";

export async function GET(request, { params }) {
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
  //   if (session.user.role !== "ADMIN" || session.user.role !== "OWNER")
  //     return NextResponse.json(
  //       { message: "You are not authorized" },
  //       { status: 403 }
  //     );
  try {
    const { id } = params;

    const resp = await prisma.roles.findMany({ where: { id } });
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
