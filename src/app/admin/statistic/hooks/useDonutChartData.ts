import { useMemo } from "react";
import { CHART_COLORS } from "../statistic.constant";
import { ModelStats } from "@/types/dashboard.type";

const useDonutChartData = (modelStats: ModelStats[]) => {
  return useMemo(() => {
    return {
      labels: modelStats.map((model: ModelStats) => model.modelName),
      datasets: [
        {
          label: "Người dùng",
          data: modelStats.map((model: ModelStats) => model.userCount),
          backgroundColor: CHART_COLORS,
          hoverOffset: 4,
        },
      ],
    };
  }, [modelStats]);
};

export { useDonutChartData };
