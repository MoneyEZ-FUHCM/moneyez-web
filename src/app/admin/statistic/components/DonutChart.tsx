import Chart, { CategoryScale, ChartData } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

Chart.register(CategoryScale);

interface DonutChartProps {
  chartData: ChartData<"doughnut">;
  options?: object;
}

const DonutChart = ({ chartData, options }: DonutChartProps) => {
  return (
    <div className="p-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Người dùng theo mô hình
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Phân bố người dùng giữa các mô hình tiết kiệm
        </p>
      </div>
      <div className="flex h-96 w-full items-center justify-center">
        <Doughnut
          data={chartData}
          options={{
            ...options,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  usePointStyle: false,
                  padding: 20,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export { DonutChart };
