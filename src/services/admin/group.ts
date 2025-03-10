import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/common.type";
import { Group } from "@/types/group.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const groupManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupList: builder.query({
      query: ({ PageIndex, PageSize, search }) => ({
        url: `/groups?PageIndex=${PageIndex}&PageSize=${PageSize}&search=${search}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Group>(response),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/groups",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation({
      query: (payload) => ({
        url: `/groups/${payload}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupListQuery,
  useCreateGroupMutation,
  useDeleteGroupMutation,
} = groupManagementApi;

export default groupManagementApi;
