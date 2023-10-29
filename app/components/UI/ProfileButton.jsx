"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@UI/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@UI/avatar";

import { signOut, useSession } from "next-auth/react";

const ProfileButton = () => {
  const { status, data: session } = useSession({ required: true });

  const signOutUrl = process.env.NEXT_PUBLIC_AUTH0_SIGNOUT_CALLBACK_URL;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger id="radix-:R1tdljacq:" asChild>
        <Avatar className="w-9 h-9 ml-2 pr-0 cursor-pointer">
          <AvatarImage src={session?.user?.image} />
          <AvatarFallback className="dark:bg-primary bg-primary text-white">
            CN
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Subscription
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: signOutUrl })}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
