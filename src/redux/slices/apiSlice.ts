import { COMMON_CONSTANT } from "@/helpers/constants/common";
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { getCookie, setCookie } from "cookies-next";

interface RefreshResultData {
  accessToken: string;
}

const axiosBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  let token = getCookie("accessToken");

  const { HTTP_METHOD, HTTP_STATUS } = COMMON_CONSTANT;

  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED
  ) {
    const refreshToken = getCookie("refreshToken");
    const rfToken = JSON.stringify(refreshToken);

    if (rfToken) {
      const res = await baseQuery(
        {
          url: "/authen/refresh-token",
          method: HTTP_METHOD.POST,
          body: rfToken,
        },
        api,
        extraOptions,
      );

      const refreshData = res.data as RefreshResultData | undefined;

      if (refreshData) {
        const newAccessToken = refreshData.accessToken;
        setCookie("accessToken", newAccessToken, { maxAge: 1 * 24 * 60 * 60 });
        token = newAccessToken;

        if (typeof args === "object") {
          result = await baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
            api,
            extraOptions,
          );
        }
      } else {
        //
      }
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});

export default apiSlice;
