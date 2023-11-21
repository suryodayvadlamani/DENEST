import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { limiter } from "../../config/limiter";
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

    const resp = await prisma.expense.findMany({
      where: { id },
      select: {
        amount: true,
        expenseType: true,
        description: true,
        expenseDate: true,
        hostelId: true,
        hostel: {
          select: {
            name: true,
            id: true,
          },
        },
      },
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

export async function DELETE(request) {
  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  const { id } = await request.json();

  try {
    await prisma.expense.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Expense Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  const { id, ...request_data } = await request.json();
  try {
    await prisma.expense.update({
      where: {
        id: id,
      },
      data: { ...request_data },
    });

    return NextResponse.json({ message: "Expense Updated" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const res = await validateRole();
  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );
  const session = await getServerSession(authOptions);
  const post_data = await request.json();

  const { amount, expenseType, description, expenseDate, hostelId } = post_data;
  try {
    await prisma.expense.create({
      data: {
        amount,
        expenseType,
        description,
        expenseDate,
        hostelId: hostelId || session.user.hostelId,
      },
    });

    return NextResponse.json({ message: "Expense Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: 500 }
    );
  }
}
