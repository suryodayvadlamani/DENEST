import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://www.denest.in"]
    : ["http://localhost:3000"];

export async function middleware(req: NextRequest) {}

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {
    const origin = req.headers.get("origin");

    if (!origin && !!allowedOrigins.includes(origin || "")) {
      const response = NextResponse.json(
        { message: "Bad Request" },
        { status: 400 }
      );
      response.headers.set("Content-Type", "text/plain");
      return response;
    }

    if (req.url.includes(`${allowedOrigins[0]}/auth`)) {
      return NextResponse.next();
    }
    console.log(req.url, allowedOrigins);
    const token = req.nextauth.token;
    ///await getToken({ req: req });
    console.log(token);
    if (!token) {
      const url = new URL(`/auth/login`, req.url);

      url.searchParams.set(
        "callbackUrl",
        encodeURI(
          req.url == `${allowedOrigins[0]}/` ? `${req.url}dashboard` : req.url
        )
      );
      return NextResponse.redirect(url);
    }
    if (
      token.role !== "ADMIN" &&
      token.role !== "OWNER" &&
      token.role !== "MANAGER"
    ) {
      const url = new URL(`/403`, req.url);
      return NextResponse.rewrite(url);
    }
    if (
      req.url.includes(`${allowedOrigins}/vendorManagment`) &&
      token.role !== "ADMIN"
    ) {
      const url = new URL(`/403`, req.url);
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) return true;
        else return false;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)", "/hostels"],
};
