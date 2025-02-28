import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { Category } from "@/types/category.types";
import { transformBaseResponse, transformCommonResponse } from "@/types/common.type";

const { HTTP_METHOD } = COMMON_CONSTANT;
const categoryManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/categories?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Category>(response),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/categories",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (payload) => ({
        url: `/categories/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategoryById: builder.query({
        query: (id) => ({
          url: `/categories/${id}`,
          method: HTTP_METHOD.GET,
        }),
        transformResponse: (response) => transformBaseResponse<Category>(response),
      }),      
  }),
});

export const {
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,  // Add this
} = categoryManagementApi;

export default categoryManagementApi;