import {
  useGetModelUsageQuery,
  useGetStatisticsQuery,
} from "@/services/admin/adminDashboard";
import { ModelStats } from "@/types/dashboard.type";
import { useEffect, useMemo, useState } from "react";

const useChartView = () => {
  const { data: statistics, isLoading: isStatisticsLoading } =
    useGetStatisticsQuery({});
  const { data: modelUsage, isLoading: isModelUsageLoading } =
    useGetModelUsageQuery({});

  const [modelStats, setModelStats] = useState<ModelStats[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, active: 0, inactive: 0 },
    totalModels: 0,
    totalCategories: 0,
    totalGroups: 0,
  });

  const isLoading = isStatisticsLoading || isModelUsageLoading;

  useEffect(() => {
    if (statistics?.data) {
      setDashboardStats(statistics.data);
    }
    if (modelUsage?.data?.models) {
      setModelStats(modelUsage.data.models);
    }
  }, [statistics, modelUsage]);

  const dashboardData = useMemo(() => {
    const revenue = modelStats?.reduce(
      (sum, model) => sum + model?.totalAmount,
      0,
    );
    const numOfOrders = modelStats?.reduce(
      (sum, model) => sum + model?.transactionCount,
      0,
    );

    return {
      revenue,
      numOfProducts: dashboardStats?.totalCategories,
      numOfStores: dashboardStats?.totalModels,
      numOfOrders,
      numOfUsers: dashboardStats?.users?.total,
      lastUpdated: new Date().toISOString(),
    };
  }, [isLoading, modelStats, dashboardStats]);

  return {
    state: {
      statistics,
      modelUsage,
      isLoading,
      modelStats,
      dashboardStats,
      dashboardData,
    },
    handler: {
      setModelStats,
      setDashboardStats,
    },
  };
};

export { useChartView };
