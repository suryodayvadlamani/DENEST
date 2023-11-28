import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@UI/navigation-menu";

import { cn } from "@/app/lib/utils";
import { siteConfig } from "@/config/site";
import { docsConfig } from "@/config/docs";
import { Icons } from "@components/icons";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import NavigationLink from "./NavigationLink";
import Image from "next/image";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const docsData =
    session?.role !== "ADMIN"
      ? docsConfig.mainNav.filter((x) => x.title !== "Vendor Managment")
      : docsConfig.mainNav;

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/logo.png" width={24} height={24} />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      <nav className="flex items-center space-x-6 text-sm font-medium">
        <NavigationMenu>
          <NavigationMenuList>
            {docsData.map((route, i) => (
              <NavigationMenuItem key={`mdNav${i}`}>
                <NavigationLink
                  key={`mdNav${i}Link`}
                  title={route.title}
                  href={route.href}
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </div>
  );
}
