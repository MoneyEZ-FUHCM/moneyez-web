"use client";

import { VALID_ROLE } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useUserInfo from "@/hooks/useUserInfo";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BASE_PATH = "/moneyez-web";

const VALID_PATHS = new Set([
  "/",
  `/notfound`,
  `/admin`,
  `/user`,
  `/auth`,
  `/admin/statistic`,
  `/admin/manage-user`,
  `/admin/manage-model`,
  `/admin/manage-category`,
  `/user/chart`,
]);

const ADMIN_PATHS = new Set([
  `/admin`,
  `/admin/statistic`,
  `/admin/manage-user`,
  `/admin/manage-model`,
  `/admin/manage-category`,
]);

const USER_PATHS = new Set([`/user`, `/user/chart`]);

const ADMIN_DYNAMIC_PATHS = /^\/admin\/(manage-category)\/[^/]+$/;

export function LoadingWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("accessToken");
  const userInfo = useUserInfo();

  useEffect(() => {
    const isValidPath =
      VALID_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname);

    if (!isValidPath) {
      router.replace(PATH_NAME.NOT_FOUND);
      return;
    }

    if (!token) {
      if (
        pathname.startsWith(PATH_NAME.USER) ||
        pathname.startsWith(PATH_NAME.ADMIN)
      ) {
        router.replace(PATH_NAME.NOT_FOUND);
      }
      return;
    }

    const role = userInfo?.userInfo?.data?.role;

    if (
      pathname === BASE_PATH ||
      pathname === PATH_NAME.HOME ||
      pathname.startsWith(PATH_NAME.AUTH)
    ) {
      router.replace(PATH_NAME.USER);
    } else if (role === VALID_ROLE.ADMIN) {
      const isAdminPathValid =
        ADMIN_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname);

      if (!isAdminPathValid) {
        router.replace(PATH_NAME.NOT_FOUND);
      }
    } else if (role === VALID_ROLE.USER) {
      if (!USER_PATHS.has(pathname)) {
        router.replace(PATH_NAME.NOT_FOUND);
      }
    }
  }, [token, pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null;

  return <>{children}</>;
}
