import { useMemo } from "react";
import { CHART_COLORS } from "../statistic.constant";

const useDonutChartData = (modelStats = []) => {
  return useMemo(() => {
    return {
      labels: modelStats.map((model) => model.modelName),
      datasets: [
        {
          label: "Người dùng",
          data: modelStats.map((model) => model.userCount),
          backgroundColor: CHART_COLORS,
          hoverOffset: 4,
        },
      ],
    };
  }, [modelStats]);
};

export { useDonutChartData };
