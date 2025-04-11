import { useMemo } from "react";

const useLineChartData = (modelStats = []) => {
  return useMemo(() => {
    return {
      labels: modelStats.map((model) => model.modelName),
      datasets: [
        {
          label: "Giao dịch",
          data: modelStats.map((model) => model.transactionCount),
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
          label: "Số dư",
          data: modelStats.map((model) => model.totalAmount / 1000000),
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
  }, [modelStats]);
};

export { useLineChartData };
