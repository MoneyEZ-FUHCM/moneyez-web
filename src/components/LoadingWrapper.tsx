"use client";

import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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
  `/user/chart`,
]);

const ADMIN_PATHS = new Set([`/admin`, `/admin/statistic`]);

const USER_PATHS = new Set([`/user`, `/user/chart`]);

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
    if (!VALID_PATHS.has(pathname)) {
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

    const decoded: any = jwtDecode(token);
    const role = decoded
      ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : COMMON_CONSTANT.CONDITION.NULL;

    if (
      pathname === BASE_PATH ||
      pathname === PATH_NAME.HOME ||
      pathname.startsWith(PATH_NAME.AUTH)
    ) {
      router.replace(PATH_NAME.USER);
    } else if (role === VALID_ROLE.ADMIN) {
      if (!ADMIN_PATHS.has(pathname)) {
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
