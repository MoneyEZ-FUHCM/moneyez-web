"use client";

import { VALID_ROLE } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useUserInfo from "@/hooks/useUserInfo";
import { selectUserInfo } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const VALID_PATHS = new Set([
  PATH_NAME.HOME,
  PATH_NAME.NOT_FOUND,
  PATH_NAME.ADMIN,
  PATH_NAME.AUTH,
  PATH_NAME.STATISTIC,
  PATH_NAME.MANAGE_USER,
  PATH_NAME.MANAGE_SPENDING_MODEL,
  PATH_NAME.MANAGE_CATEGORY,
  PATH_NAME.MANAGE_SUB_CATEGORY,
  PATH_NAME.MANAGE_NOTIFICATION,
  PATH_NAME.MANAGE_GROUP,
  PATH_NAME.MANAGE_QUIZ,
  PATH_NAME.MANAGE_POST,
]);

const ADMIN_PATHS = new Set([
  PATH_NAME.ADMIN,
  PATH_NAME.STATISTIC,
  PATH_NAME.MANAGE_USER,
  PATH_NAME.MANAGE_SPENDING_MODEL,
  PATH_NAME.MANAGE_CATEGORY,
  PATH_NAME.MANAGE_SUB_CATEGORY,
  PATH_NAME.MANAGE_NOTIFICATION,
  PATH_NAME.MANAGE_GROUP,
  PATH_NAME.MANAGE_QUIZ,
  PATH_NAME.MANAGE_POST,
]);

const USER_PATHS = new Set(["/user", "/user/chart"]);
const ADMIN_DYNAMIC_PATHS =
  /^\/admin\/(manage-category|manage-user|manage-sub-category|manage-model|manage-group)\/[^/]+$/;

export function LoadingWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("accessToken");
  const { refetch, isLoading: loading } = useUserInfo();
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (!token) {
      if (
        pathname.startsWith(PATH_NAME.USER) ||
        pathname.startsWith(PATH_NAME.ADMIN)
      ) {
        router.replace(PATH_NAME.AUTH);
      }
      return;
    }

    if (loading || !userInfo) return;

    const role = userInfo?.role;

    const isValidPath =
      VALID_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname);
    if (!isValidPath) {
      router.replace(PATH_NAME.NOT_FOUND);
      return;
    }

    if (role === VALID_ROLE.ADMIN) {
      if (!(ADMIN_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname))) {
        router.replace(PATH_NAME.STATISTIC);
      }
    } else if (role === VALID_ROLE.USER) {
      if (!USER_PATHS.has(pathname)) {
        router.replace(PATH_NAME.USER);
      }
    }
  }, [token, pathname, loading, userInfo]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading || loading) return null;

  return <>{children}</>;
}
