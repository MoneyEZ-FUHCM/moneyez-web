"use client";

import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useBarChartData } from "../hooks/useBarChartData";
import { useDonutChartData } from "../hooks/useDonutChartData";
import { useLineChartData } from "../hooks/useLineChartData";
import { barOptions, lineOptions } from "../statistic.constant";
import { BarChart } from "./BarChart";
import { DonutChart } from "./DonutChart";
import { LineChart } from "./LineChart";
import { ModelUsageTable } from "./ModelUsageTable";
import { TotalField } from "./TotalField";

const ChartView = () => {
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    totalModels: 0,
    totalCategories: 0,
    totalGroups: 0,
  });
  const [modelStats, setModelStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const lineData = useLineChartData(modelStats);
  const donutData = useDonutChartData(modelStats);
  const barData = useBarChartData(modelStats);

  useEffect(() => {
    setTimeout(() => {
      setDashboardStats({
        users: { total: 30, active: 30, inactive: 0 },
        totalModels: 3,
        totalCategories: 10,
        totalGroups: 14,
      });

      setModelStats([
        {
          modelId: "07cf8539-b128-4893-0493-08dd50ff44f3",
          modelName: "6-JARS",
          userCount: 15,
          transactionCount: 106,
          totalAmount: 127568664,
        },
        {
          modelId: "d61352cd-9a19-46a3-0494-08dd50ff44f3",
          modelName: "50-30-20",
          userCount: 5,
          transactionCount: 24,
          totalAmount: 34134665,
        },
        {
          modelId: "14f47b4d-e5e5-4e7a-0495-08dd50ff44f3",
          modelName: "80-20",
          userCount: 0,
          transactionCount: 0,
          totalAmount: 0,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const dashboardData = {
    revenue: modelStats.reduce((total, model) => total + model.totalAmount, 0),
    numOfProducts: dashboardStats.totalCategories,
    numOfStores: dashboardStats.totalModels,
    numOfOrders: modelStats.reduce(
      (total, model) => total + model.transactionCount,
      0,
    ),
    numOfUsers: dashboardStats.users.total,
    lastUpdated: new Date().toISOString(),
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-6">
      <div className="px-6">
        <TotalField data={dashboardData} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 px-6 md:grid-cols-3">
        <div className="col-span-1 overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg md:col-span-2">
          <LineChart chartData={lineData} options={lineOptions} />
        </div>

        <div className="col-span-1 overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="flex h-full flex-col justify-center px-2">
            <DonutChart chartData={donutData} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg">
          <BarChart chartData={barData} options={barOptions} />
        </div>

        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Thống kê sử dụng mô hình
          </h2>
          <ModelUsageTable modelStats={modelStats} />
        </div>
      </div>
    </section>
  );
};

export { ChartView };
