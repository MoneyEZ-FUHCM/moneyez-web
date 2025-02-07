import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { showToast } from "./useShowToast";

export const useLogout = () => {
  const { SYSTEM_SUCCESS } = COMMON_CONSTANT;
  const router = useRouter();
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace(PATH_NAME.AUTH);
    showToast(TOAST_STATUS.SUCCESS, SYSTEM_SUCCESS.LOGOUT);
  };

  return { logout };
};
