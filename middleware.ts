import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://www.denest.in"]
    : ["http://localhost:3000"];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (!origin && !!allowedOrigins.includes(origin || "")) {
    const response = NextResponse.json(
      { message: "Bad Request" },
      { status: 400 }
    );
    response.headers.set("Content-Type", "text/plain");
    return response;
  }

  if (req.url.includes(`${allowedOrigins}/auth`)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: req });
  console.log(token, "To understand what happeing");
  // if (!token) {
  //   const url = new URL(`/auth/login`, req.url);

  //   url.searchParams.set("callbackUrl", encodeURI(req.url));
  //   return NextResponse.redirect(url);
  // }
  // if (
  //   token.role !== "ADMIN" &&
  //   token.role !== "OWNER" &&
  //   token.role !== "MANAGER"
  // ) {
  //   const url = new URL(`/403`, req.url);
  //   return NextResponse.rewrite(url);
  // }
  // if (
  //   req.url.includes(`${allowedOrigins}/vendorManagment`) &&
  //   token.role !== "ADMIN"
  // ) {
  //   const url = new URL(`/403`, req.url);
  //   return NextResponse.rewrite(url);
  // }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"],
};
