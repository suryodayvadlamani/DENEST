import { LuFilter } from "react-icons/lu";
import { buttonVariants } from "@UI/button";

import { cn } from "@lib/utils";
function Filter(props) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "w-9 px-0 cursor-pointer"
      )}
    >
      <LuFilter className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    </div>
  );
}

export default Filter;
