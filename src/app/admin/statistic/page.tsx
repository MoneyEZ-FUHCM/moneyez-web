"use client";

import dayjs from "dayjs";
import { DonutChart, LineChart, TotalField } from "./components";
import {
  DASHBOARD_DATA,
  MAIN_CHART_DATA,
  REVENUE_DATA,
} from "./statistic.constant";

const ChartView = () => {
  // Hardcoded data
  const getAllDaysInCurrentWeek = () => {
    const currentDate = dayjs();
    const startOfWeek =
      currentDate.day() === 0
        ? currentDate.day(-6).startOf("day")
        : currentDate.day(1).startOf("day");
    const daysInWeek = 7;
    const labels = [];
    const displayLabels = [];
    const dayNames = [];

    for (let day = 0; day < daysInWeek; day++) {
      const date = startOfWeek.add(day, "day");
      labels.push(date.format("DD/MM/YYYY"));
      displayLabels.push(date.format("DD"));
      dayNames.push(date.format("dddd"));
    }

    return { labels, displayLabels, dayNames };
  };

  const lineData = {
    labels: getAllDaysInCurrentWeek().dayNames,
    datasets: [
      {
        label: "Đơn hàng",
        data: getAllDaysInCurrentWeek().labels.map((date) => {
          return (
            MAIN_CHART_DATA.find(
              (data) => dayjs(data.date).format("DD/MM/YYYY") === date,
            )?.orderCount || 0
          );
        }),
        type: "bar",
        borderColor: "rgba(0, 143, 251, 0.85);",
        pointBorderWidth: 1,
        pointBackgroundColor: "#1b8bd6",
        pointBorderColor: "#36A2EB",
        backgroundColor: "rgba(0, 143, 251, 1)",
        yAxisID: "y",
        order: 2,
        barThickness: 30,
      },
      {
        label: "Doanh thu",
        data: getAllDaysInCurrentWeek().labels.map((date) => {
          return (
            MAIN_CHART_DATA.find(
              (data) => dayjs(data.date).format("DD/MM/YYYY") === date,
            )?.revenue || 0
          );
        }),
        borderColor: "rgb(0, 227, 150)",
        pointBorderWidth: 1,
        pointBackgroundColor: "rgb(0, 227, 150)",
        pointBorderColor: "#FFFFFF",
        backgroundColor: "rgb(0, 227, 150)",
        yAxisID: "y1",
        order: 1,
      },
    ],
  };

  const donutData = {
    labels: REVENUE_DATA.map((data) => data.storeName),
    datasets: [
      {
        label: "Doanh thu",
        data: REVENUE_DATA.map((data) => data.revenue),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverOffset: 4,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      datalabels: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 2,
        backgroundColor: "currentColor",
        hoverRadius: 4,
        hitRadius: 6,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    responsive: true,
  };

  return (
    <>
      <div className="p-5">
        <TotalField data={DASHBOARD_DATA} />
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
        <div className="col-span-1 rounded-xl bg-[#fff] shadow-md sm:col-span-2">
          <LineChart chartData={lineData} options={lineOptions} />
        </div>

        <div className="col-span-1 flex flex-col rounded-xl bg-[#fff] sm:col-span-1">
          <div className="h-full flex-1">
            <DonutChart chartData={donutData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartView;
