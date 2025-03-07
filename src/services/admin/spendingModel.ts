import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/common.type";
import { SpendingModel } from "@/types/spendingModel.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const spendingModelManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpendingModelList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/spending-models?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<SpendingModel>(response),
      providesTags: ["SpendingModel"],
    }),
    createSpendingModel: builder.mutation({
      query: (payload) => ({
        url: "/spending-models",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
    deleteSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/spending-models/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["SpendingModel"],
    }),
  }),
});

export const {
  useGetSpendingModelListQuery,
  useCreateSpendingModelMutation,
  useDeleteSpendingModelMutation,
} = spendingModelManagementApi;

export default spendingModelManagementApi;
