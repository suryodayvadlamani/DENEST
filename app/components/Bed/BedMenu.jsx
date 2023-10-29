"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@UI/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@UI/dialog";
import { BiBed } from "react-icons/bi";
import AssignTenant from "../User/AssignTenant";
import { useState } from "react";
import { Button } from "@UI/button";
import { deleteBed } from "@/app/server_functions/Bed";
const BedMenu = ({ bedId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const removeBed = async () => {
    setLoading(true);
    await deleteBed({ id: bedId });
    setLoading(false);
    setOpen(false);
  };
  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <BiBed className="text-4xl lg:text-6xl cursor-pointer" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                Assign
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="h-4/5 overflow-auto">
          <DialogHeader>
            <DialogTitle>Assign Tenant</DialogTitle>
          </DialogHeader>
          <AssignTenant bedId={bedId} />
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              bed and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="mr-2"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={removeBed} isLoading={loading} disabled={loading}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BedMenu;
