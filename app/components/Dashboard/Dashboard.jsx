"use client";
import { RiDoorOpenFill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";
import { BsGraphDownArrow } from "react-icons/bs";
import KPI from "./KPI";
import { Card, CardContent, CardTitle } from "@UI/card";
import dynamic from "next/dynamic";
import GaugeChart from "@components/Charts/Guage";
import { useMemo } from "react";
import { useState } from "react";

import { columns } from "@components/Dashboard/Columns";
import { DataTable } from "@components/DataTable/DataTable";
import AddDue from "@components/Dashboard/AddDue";

const Barchart = dynamic(() => import("@components/Charts/Barchart"), {
  ssr: false,
});

const Dashboard = ({ hostelsData, dashboardData, allExpenseData }) => {
  const [guageData, setGuageData] = useState({});
  const makeReducer = (acc, cur) => {
    const newQty = parseInt(acc[cur?.month] ?? 0) + parseInt(cur.amount);
    const a = {};
    a[cur.month] = newQty;
    return {
      ...acc,
      ...a,
    };
  };
  const { occupied, totalBeds } = useMemo(() => {
    if (!hostelsData) return { occupied: 0, totalBeds: 0 };
    return hostelsData.reduce(
      function (acc, hostel) {
        const oc = hostel?.Rooms.reduce(function (oacc, room) {
          return oacc + room.Beds.filter((bed) => bed.occupied).length;
        }, 0);
        const tb = hostel?.Rooms.reduce(function (tacc, room) {
          return tacc + room.Beds.length;
        }, 0);

        return {
          occupied: acc.occupied + oc,
          totalBeds: acc.totalBeds + tb,
        };
      },
      { occupied: 0, totalBeds: 0 }
    );
  }, [hostelsData]);

  const { totalRent, barData } = useMemo(() => {
    let paidData = dashboardData?.paidData
      .map((a) => {
        return {
          amount: a.amount,
          month: new Date(a.paidDate).toLocaleString("default", {
            month: "short",
          }),
        };
      })
      .reduce(makeReducer, {});
    let expenseData = dashboardData?.expenseData
      .map((a) => {
        return {
          amount: a.amount,
          type: a.expenseType,
          month: new Date(a.expenseDate).toLocaleString("default", {
            month: "short",
          }),
        };
      })
      .reduce(makeReducer, {});

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const totalRent = dashboardData?.rentData.reduce((acc, cur) => {
      return acc + cur.rent;
    }, 0);
    const barData = months.map((x) => {
      return {
        name: x,
        Income: (paidData && paidData[x]) || 0,
        Expenditure: (expenseData && expenseData[x]) || 0,
      };
    });
    return { totalRent, barData };
  }, [dashboardData]);

  const gData = useMemo(() => {
    const totalExpense = barData.reduce((acc, cur) => {
      return acc + cur.Expenditure;
    }, 0);
    const totalIncome = barData.reduce((acc, cur) => {
      return acc + cur.Income;
    }, 0);
    const data = [
      {
        legend: "Income",
        value: totalIncome,
        color: "fill-primary",
      },
      {
        legend: "Expense",
        value: totalExpense,
        color: "fill-muted-foreground",
      },
    ];
    setGuageData(data);
  }, [barData]);

  return (
    <div className="container flex flex-col gap-3 h-full">
      <div className="flex flex-col md:flex-row gap-3 w-full md:h-2/3 ">
        <div className="flex flex-col gap-3 md:w-2/3">
          <div className="flex flex-wrap md:flex-row gap-3 justify-between">
            <KPI
              icon={<RiDoorOpenFill />}
              title={"Vacant Rooms"}
              value={`${occupied}/${totalBeds}`}
            />
            <KPI
              icon={<BsGraphUpArrow />}
              title={"High Perfomance"}
              value={"80%"}
            />
            <KPI
              icon={<BsGraphDownArrow />}
              title={"Low Perfomance"}
              value={"20%"}
            />
            <KPI
              icon={<BsPeopleFill />}
              title={"Rent Collected"}
              value={`${Math.round(
                ((barData.filter(
                  (x) =>
                    x.name ==
                    new Date().toLocaleString("default", {
                      month: "short",
                    })
                )[0]?.Income || 0) /
                  totalRent) *
                  100
              )}%`}
            />
          </div>
          <Card className="w-full">
            <CardTitle className="p-6">Income vs Expenses</CardTitle>
            <CardContent className="m-2">
              <Barchart data={barData} width={"100%"} height={400} />
            </CardContent>
          </Card>
        </div>

        <AddDue />
      </div>
      <div className="flex flex-col md:flex-row gap-3 w-full md:h-1/3">
        <Card className="flex flex-col gap-3 md:w-2/3 w-full">
          <CardTitle className="p-6">Expenses</CardTitle>
          <CardContent className="m-2">
            {allExpenseData?.length > 0 && (
              <DataTable
                columns={columns}
                data={allExpenseData}
                pagination={true}
                sorting={true}
                className={"mt-4 flex-1"}
              />
            )}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardTitle className="p-6">Revenue overview</CardTitle>
          <CardContent className="m-2">
            <GaugeChart data={guageData} width={"100%"} height={200} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
