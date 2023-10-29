"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/app/lib/utils";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@UI/navigation-menu";
import Link from "next/link";
function NavigationLink({ title, href }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      passHref
      legacyBehavior
      className={cn("transition-colors hover:text-foreground/80")}
    >
      <NavigationMenuLink
        className={cn(
          navigationMenuTriggerStyle(),
          pathname?.startsWith(href)
            ? "text-accent-foreground"
            : "text-accent-foreground/60"
        )}
      >
        {title}
      </NavigationMenuLink>
    </Link>
  );
}

export default NavigationLink;
