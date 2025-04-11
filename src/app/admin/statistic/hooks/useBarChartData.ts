import { useMemo } from "react";
import { CHART_COLORS } from "../statistic.constant";

const useBarChartData = (modelStats = []) => {
  return useMemo(() => {
    const avgPerUser = modelStats.map((model) => {
      if (model.userCount === 0) return 0;
      return Math.round(model.totalAmount / model.userCount);
    });

    const avgPerTransaction = modelStats.map((model) => {
      if (model.transactionCount === 0) return 0;
      return Math.round(model.totalAmount / model.transactionCount);
    });

    // Calculate transactions per user ratio
    const transactionsPerUser = modelStats.map((model) => {
      if (model.userCount === 0) return 0;
      return parseFloat((model.transactionCount / model.userCount).toFixed(1));
    });

    const modelNames = modelStats.map((model) => model.modelName);

    return {
      labels: modelNames,
      datasets: [
        {
          label: "Giao dịch trung bình/người dùng",
          data: transactionsPerUser,
          backgroundColor: CHART_COLORS[0],
          barPercentage: 0.8,
          order: 1,
        },
        {
          label: "Số lượng người dùng",
          data: modelStats.map((model) => model.userCount),
          backgroundColor: CHART_COLORS[1],
          barPercentage: 0.8,
          order: 2,
        },
        {
          label: "Số lượng giao dịch",
          data: modelStats.map((model) => model.transactionCount),
          backgroundColor: CHART_COLORS[2],
          barPercentage: 0.8,
          order: 3,
        },
      ],
    };
  }, [modelStats]);
};

export { useBarChartData };
