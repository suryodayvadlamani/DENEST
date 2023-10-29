import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../prisma/prisma";

export async function POST(req) {
  try {
    const data = await req.json();

    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const res_data = await prisma.user.findMany({
      where: {
        email: { equals: email },
      },
    });
    if (res_data.length > 0)
      return NextResponse.json({ message: "Try other email" }, { status: 409 });

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
