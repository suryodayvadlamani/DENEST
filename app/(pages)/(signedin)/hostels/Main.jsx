"use client";
import { buttonVariants } from "@UI/button";
import HostelCard from "@components/Hostel/HostelCard";
import FormDialog from "@components/Form/FormDialog";
import AddHostel from "@components/Hostel/AddHostel";
import { cn } from "@lib/utils";
import { getHostelsFn } from "@/app/helpers/hostel";

function Main() {
  const { data } = getHostelsFn();
  const hostelsData = { data: data?.data.finalData };
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
          Total Hostels : {hostelsData?.data?.length}
        </div>

        <FormDialog title="Add Hostel" triggerTitle="Add Hostel">
          <AddHostel />
        </FormDialog>
      </div>
      <div className="flex flex-col gap-2">
        {hostelsData?.data &&
          hostelsData?.data.map((hostel) => {
            return (
              <HostelCard key={`hostelCard${hostel.id}`} hostel={hostel} />
            );
          })}
      </div>
    </>
  );
}

export default Main;
