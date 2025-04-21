import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const adminDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModelUsage: builder.query({
      query: () => ({
        url: `/admin/dashboard/model-usage`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getStatistics: builder.query({
      query: () => ({
        url: `/admin/dashboard/statistics`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetModelUsageQuery, useGetStatisticsQuery } =
  adminDashboardApi;

export default adminDashboardApi;
