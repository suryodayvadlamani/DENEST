"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useStore } from "@/app/store/store";
import { cn } from "@lib/utils";
import { Button } from "@UI/button";
import { Calendar } from "@UI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@UI/popover";
import { useState } from "react";

export default function DatePickerWithRange({
  className,
  callBack,
  defaultDate,
}) {
  const [state, setState] = useState(false);
  const [date, setDate] = useState({
    from: new Date(defaultDate.startDate),
    to: new Date(defaultDate.endDate),
  });
  const okClick = () => {
    callBack({
      startDate: date.from && new Date(date.from).toISOString(),
      endDate: date.to && new Date(date.to).toISOString(),
    });
    setState(false);
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={state} onOpenChange={setState}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <section className="flex flex-row gap-4 items-center justify-around my-2">
            <Button onClick={okClick}> OK</Button>
            <Button onClick={() => setState(false)}> Cancel</Button>
          </section>
        </PopoverContent>
      </Popover>
    </div>
  );
}
