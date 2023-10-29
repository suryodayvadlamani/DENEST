import { buttonVariants } from "@UI/button";
import HostelCard from "@components/Hostel/HostelCard";
import FormDialog from "@components/Form/FormDialog";
import AddHostel from "@components/Hostel/AddHostel";
import { cn } from "@lib/utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { getHostels } from "@/app/server_functions/Hostels";

export default async function Hostels() {
  const session = await getServerSession(authOptions);
  const { isError, data: hostelsData } = await getHostels();

  if (isError) {
    return <p>Sorry Error</p>;
  }
  return (
    <>
      <div className="flex flex-row gap-5 my-4">
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "text-lg"
          )}
        >
          Total Hostels {hostelsData?.length}
        </div>

        {session?.role === "OWNER" && (
          <FormDialog title="Add Hostel" triggerTitle="+Add Hostel">
            <AddHostel />
          </FormDialog>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {hostelsData &&
          hostelsData.map((hostel) => {
            return (
              <HostelCard key={`hostelCard${hostel.id}`} hostel={hostel} />
            );
          })}
      </div>
    </>
  );
}
