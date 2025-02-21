import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

interface RefreshResultData {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  data?: {
    data?: RefreshResultData;
  };
  error?: unknown;
}

const axiosBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  const { HTTP_STATUS, HTTP_METHOD } = COMMON_CONSTANT;
  let token = getCookie("accessToken");

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

    if (refreshToken) {
      const res = (await baseQuery(
        {
          url: "/auth/refresh-token",
          method: HTTP_METHOD.POST,
          body: JSON.stringify(refreshToken),
        },
        api,
        extraOptions,
      )) as RefreshResponse;

      const refreshData = res?.data?.data;

      if (refreshData) {
        const { accessToken, refreshToken: newRefreshToken } = refreshData;
        setCookie("accessToken", accessToken, { maxAge: 1 * 24 * 60 * 60 });
        setCookie("refreshToken", newRefreshToken, {
          maxAge: 1 * 24 * 60 * 60,
        });
        token = accessToken;

        if (typeof args === "object") {
          result = await baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            },
            api,
            extraOptions,
          );
        }
      } else {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        window.location.replace("/moneyez-web/auth");
      }
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "SpendingModel", "Category", "SubCategory"],
});

export default apiSlice;
