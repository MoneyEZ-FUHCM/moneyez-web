import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { showToast } from "./useShowToast";

export const useLogout = () => {
  const { SYSTEM_SUCCESS } = COMMON_CONSTANT;
  const router = useRouter();
  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("email");
    deleteCookie("password");
    router.replace(PATH_NAME.AUTH);
    showToast(TOAST_STATUS.SUCCESS, SYSTEM_SUCCESS.LOGOUT);
  };

  return { logout };
};
