import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@UI/dialog";
import { Button } from "@UI/button";
import { cn } from "@lib/utils";
import React from "react";
function FormDialog({
  title,
  triggerTitle,
  triggerClass,
  triggerVariant = "default",
  children,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("", triggerClass)}
          aria-controls="radix-:R2jdd6qdljacq:"
          variant={triggerVariant}
        >
          {triggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-4/5 overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
