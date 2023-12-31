"use client";

import Link from "next/link";

import { docsConfig } from "@/config/docs";
import { Sheet, SheetContent, SheetTrigger } from "@UI/sheet";

import FormDialog from "@components/Form/FormDialog";
import { Icons } from "@components/icons";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@UI/button";
import { LuMoreVertical } from "react-icons/lu";
import { siteConfig } from "@/config/site";
import { ScrollArea } from "@UI/scroll-area";
import { useRouter } from "next/navigation";
import { cn } from "@lib/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [navData, setNavData] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const docsData =
      session?.role !== "ADMIN"
        ? docsConfig.mainNav.filter((x) => x.title !== "Vendor Managment")
        : docsConfig.mainNav;
    setNavData(docsData);
  }, [session]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-controls="radix-:R9dljacq:"
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <LuMoreVertical className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 ">
          <div className="flex flex-col space-y-3">
            {navData?.map(
              (item) =>
                item.href && (
                  <section key={item.href}>
                    <MobileLink
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "hover:bg-transparent hover:underline",
                        "justify-start flex flex-row gap-2"
                      )}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                    {docsConfig.sidebarNav[item.title]?.map((item, index) =>
                      item.isForm ? (
                        <FormDialog
                          key={`${item.title}_formdialog_${index}`}
                          triggerClass={"justify-start items-start"}
                          title={item.title}
                          triggerVariant={"ghost"}
                          triggerTitle={
                            <>
                              {<item.icon className="mr-2 " />}
                              {item.title}
                            </>
                          }
                        >
                          <item.Form />
                        </FormDialog>
                      ) : (
                        <MobileLink
                          key={item.href}
                          href={item.href}
                          onOpenChange={setOpen}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "hover:bg-transparent hover:underline",
                            "justify-start flex flex-row gap-2"
                          )}
                        >
                          {<item.icon />}
                          <span className="flex">{item.title}</span>
                        </MobileLink>
                      )
                    )}
                  </section>
                )
            )}

            {/* Sidebar nav start*/}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
function MobileLink({ href, onOpenChange, className, children, ...props }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
