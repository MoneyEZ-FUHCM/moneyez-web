import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { SubCategory } from "@/types/category.types";
import { transformCommonResponse } from "@/types/common.type";

const { HTTP_METHOD } = COMMON_CONSTANT;
const subSubCategoryManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategoryList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/subcategories?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<SubCategory>(response),
      providesTags: ["SubCategory"],
    }),
    createSubCategory: builder.mutation({
      query: (payload) => ({
        url: "/subcategories",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (payload) => ({
        url: `/subcategories/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useGetSubCategoryListQuery,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subSubCategoryManagementApi;

export default subSubCategoryManagementApi;
