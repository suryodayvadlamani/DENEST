import prisma from "../../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { validateRole } from "app/helpers/validateRole";

export async function GET(request, { params }) {
  const res = await validateRole();
  console.log("Came");
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  try {
    const { hostelId } = params;

    let resp = await prisma.userRoles.findMany({
      where: { hostelId: hostelId },
    });

    const userIds = resp.map((ur) => ur.userId);

    let rentData = await prisma.tenantRoom.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        rent: true,
      },
    });
    const paidData = await prisma.tenantPay.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        amount: true,
      },
    });
    rentData = rentData.map((ren) => {
      const amount = paidData.filter((x) => x.userId == ren.userId);

      return {
        ...ren,
        amount: amount.length > 0 ? amount[0].amount : 0,
      };
    });

    return NextResponse.json(rentData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
