"use client";
import { Pie, PieChart, ResponsiveContainer, Cell, Label } from "recharts";
import { cn } from "@/app/lib/utils";

export default function Mypiechart({ name, data, statusPer, height, width }) {
  const occupancy = 50;

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          labelLine={false}
          data={data}
          dataKey={"value"}
          nameKey={"name"}
          innerRadius={40}
          outerRadius={60}
          cx={"40%"}
          paddingAngle={3}
        >
          {data?.map((entry, index) => (
            <Cell key={`${name}${index}`} className={cn(entry.fill)} />
          ))}
          <Label
            value={`${statusPer}%`}
            position="center"
            className="fill-primary"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
