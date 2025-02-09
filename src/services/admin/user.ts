import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const manageUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetUsersQuery } = manageUserApi;

export default manageUserApi;
