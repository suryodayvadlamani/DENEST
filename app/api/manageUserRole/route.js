import { getServerSession } from "next-auth";
import prisma from "../../../prisma/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { limiter } from "../config/limiter";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  const res = await validateRole();

  if (res?.error)
    return NextResponse.json(
      { message: res.error },
      { status: res.statusCode }
    );

  const { userEmail, roleId, isActive, vendorId, hostelId, roleName } =
    await request.json();

  const userData = await prisma.user.findMany({ where: { email: userEmail } });
  const roleInfo = await findRole({
    AND: {
      userId: { equals: userData[0].id },
      isActive: { equals: isActive },
    },
  });
  if (roleInfo.length > 0) {
    if (roleInfo.roleId === roleId) {
      return NextResponse.json({ message: "Role created" }, { status: 201 });
    } else {
      await updateRole(userData[0].id, {
        isActive: false,
        expired: new Date(),
      });
    }
  }
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
  const resp = await createRole(data);

  if (resp == 201)
    return NextResponse.json({ message: "Hostel Registered" }, { status: 201 });
  else
    return NextResponse.json(
      { message: "Sorry not a lucky day try again" },
      { status: resp }
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

export async function findRole(whereClause, sortClause) {
  try {
    let options = { where: { ...whereClause } };
    if (sortClause) {
      options = { ...options, orderBy: sortClause };
    }
    const resp = await prisma.userRoles.findMany(options);
    return resp;
  } catch (err) {
    return 500;
  }
}
export async function updateRole(userId, data) {
  try {
    const updateUser = await prisma.userRoles.update({
      where: {
        userId: { equals: userId },
      },
      data,
    });

    return resp;
  } catch (err) {
    return 500;
  }
}
