import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { transformCommonResponse } from "@/helpers/types/common.type";
import { Post } from "@/helpers/types/post.types";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const postManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPostList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/posts?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Post>(response),
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (payload) => ({
        url: "/posts",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: (payload) => ({
        url: `/posts`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostListQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postManagementApi;

export default postManagementApi;
