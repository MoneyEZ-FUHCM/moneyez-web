"use client";

import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BASE_PATH = "/moneyez-web";

const validPaths = new Set([
  `${BASE_PATH}`,
  `${BASE_PATH}/notfound`,
  `${BASE_PATH}/admin`,
  `${BASE_PATH}/user`,
  `${BASE_PATH}/auth`,
  `${BASE_PATH}/admin/statistic`,
]);

const adminAllowedPaths = new Set([
  `${BASE_PATH}/admin`,
  `${BASE_PATH}/admin/statistic`,
]);

export function LoadingWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("accessToken");

  useEffect(() => {
    const fullPath = window.location.pathname;
    console.log("check fullPath", fullPath);

    if (typeof window !== "undefined") {
      if (!validPaths.has(fullPath)) {
        router.replace(PATH_NAME.NOT_FOUND);
        return;
      }
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

    const decoded: any = jwtDecode(token);
    const role = decoded
      ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : COMMON_CONSTANT.CONDITION.NULL;

    if (pathname === PATH_NAME.HOME || pathname.startsWith(PATH_NAME.AUTH)) {
      router.replace(PATH_NAME.USER);
    } else if (role === VALID_ROLE.ADMIN) {
      if (!adminAllowedPaths.has(fullPath)) {
        router.replace(PATH_NAME.NOT_FOUND);
      }
    } else if (role === VALID_ROLE.USER) {
      if (fullPath !== `${BASE_PATH}/chart`) {
        router.replace(PATH_NAME.NOT_FOUND);
      }
    }
  }, [token, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null;

  return <>{children}</>;
}
