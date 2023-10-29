import React from "react";
import {
  Sector,
  Cell,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/app/lib/utils";
import { IoIosRadioButtonOn } from "react-icons/io";
const GaugeChart = ({ data, height, width }) => {
  const chartValue = data[0].value;
  const renderLegend = (props) => {
    let { payload } = props;
    payload = payload.filter((x) => ["Expense", "Income"].includes(x.value));

    return (
      <div className="flex flex-row gap-4 justify-center w-full ">
        {payload.map((entry, index) => (
          <div
            className={cn(
              entry.payload.color.replace("fill", "text"),
              "flex flex-row items-center gap-1"
            )}
            key={`item-${index}`}
          >
            <IoIosRadioButtonOn />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };
  const activeSectorIndex = data
    .map((cur, index, arr) => {
      const curMax = [...arr]
        .splice(0, index + 1)
        .reduce((a, b) => ({ value: a.value + b.value })).value;
      return chartValue > curMax - cur.value && chartValue <= curMax;
    })
    .findIndex((cur) => cur);

  const sumValues = data.map((cur) => cur.value).reduce((a, b) => a + b);

  const arrowData = [
    { value: chartValue },
    { value: 0 },
    { value: sumValues - chartValue },
  ];

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    cx: width / 2,
    cy: width / 2,
  };

  const pieRadius = {
    innerRadius: "80%",
    outerRadius: (width / 2) * 0.4,
  };

  const Arrow = ({ cx, cy, midAngle, outerRadius }) => {
    //eslint-disable-line react/no-multi-comp
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + width * 0.03) * cos;
    const my = cy + (outerRadius + width * 0.03) * sin;
    //alert(cy + ' --'+cx +'---'+ mx+ '----' + my+'--'+midAngle +'--'+sin+'--'+cos+'--'+RADIAN)
    return (
      <g>
        <g transform={`translate(170, 105) rotate(${360 - midAngle})`}>
          <path
            d="M5.60469 9.37139C2.82684 9.54267 0.429368 7.66264 0.276978 5.19354C0.124588 2.72445 2.27269 0.564139 5.05054 0.392861L63.1551 1.279L5.60469 9.37139Z"
            fill="#2E2E2E"
          />
        </g>
      </g>
    );
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <text x={255} y={120} textAnchor="middle" dominantBaseline="middle">
          {`${Math.round(((sumValues - chartValue) / sumValues) * 100)}%`}
        </text>
        <text x={120} y={120} textAnchor="middle" dominantBaseline="middle">
          {`${Math.round((chartValue / sumValues) * 100)}%`}
        </text>

        <Pie
          activeIndex={activeSectorIndex}
          innerRadius="55%"
          data={data}
          dataKey={"value"}
          nameKey={"legend"}
          blendStroke
          fill="#8884d8"
          {...pieProps}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} className={cn(data[index].color)} />
          ))}
        </Pie>
        <Legend
          content={renderLegend}
          verticalAlign="middle"
          wrapperStyle={{ top: "140px" }}
        />
        <Pie
          stroke="none"
          activeIndex={1}
          dataKey={"value"}
          activeShape={Arrow}
          data={arrowData}
          outerRadius={pieRadius.innerRadius}
          fill="none"
          {...pieProps}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GaugeChart;
