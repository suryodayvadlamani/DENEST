import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { limiter } from "@/app/api/config/limiter";
export async function validateRole() {
  const remaining = await limiter.removeTokens(1);
  if (remaining < 0) return { error: "Too many requests", statusCode: "429" };
  const session = await getServerSession(authOptions);
  if (!session)
    return { error: "You don't have persmision!", statusCode: "401" };
  if (
    session.role !== "ADMIN" &&
    session.role !== "OWNER" &&
    session.role !== "MANAGER"
  )
    return { error: "You are not authorized", statusCode: "403" };
}
