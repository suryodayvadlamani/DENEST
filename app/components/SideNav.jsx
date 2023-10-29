import Link from "next/link";
import { cn } from "@lib/utils";
import { buttonVariants } from "@UI/button";
import FormDialog from "@components/Form/FormDialog";
export default function SideNav({ className, items, ...props }) {
  return (
    <nav
      className={cn(" flex space-x-0 space-y-1 flex-col", className)}
      {...props}
    >
      {items?.map((item) =>
        item.isForm ? (
          <FormDialog
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
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hover:bg-transparent hover:underline",
              "justify-start flex flex-row gap-2"
            )}
          >
            {<item.icon />}
            <span className="hidden md:flex">{item.title}</span>
          </Link>
        )
      )}
    </nav>
  );
}
