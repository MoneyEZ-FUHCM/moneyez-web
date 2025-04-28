import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { transformCommonResponse } from "@/helpers/types/common.type";
import { User } from "@/helpers/types/user.types";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/users?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<User>(response),
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/users/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} = userManagementApi;

export default userManagementApi;
