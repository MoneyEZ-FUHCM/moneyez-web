import { useGetUserListQuery } from "@/services/admin/user";
import { TablePaginationConfig } from "antd";
import { useCallback, useState } from "react";
import { MANAGE_USER_CONSTANT } from "../user.constant";
import { TEXT_TRANSLATE } from "../user.translate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsOpen } from "@/redux/slices/modalSlice";

const useUserManagementPage = () => {
  const { FORM_NAME } = MANAGE_USER_CONSTANT;
  const { TITLE, BUTTON } = TEXT_TRANSLATE;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingUserList } = useGetUserListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const handleOpenModalAdd = useCallback(() => {
    dispatch(setIsOpen(true));
  }, []);

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  // const handleDeleteUser = useCallback(async (userId: number) => {
  //   try {
  //     const res = await deleteUser(userId);
  //     if (res && res.status === 200) {
  //       handleRefetch();
  //       notify("success", `${res.data.message}`, 3);
  //     }
  //   } catch (err: any) {
  //     console.error("err", err);
  //     showToast("error", `${err.response.data.message}`, 3);
  //   }
  // }, []);

  return {
    state: {
      data,
      isLoadingUserList,
      pageIndex,
      pageSize,
      isOpen,

      FORM_NAME,
      TITLE,
      BUTTON,
    },

    handler: {
      handlePageChange,
      handleOpenModalAdd,
    },
  };
};

export { useUserManagementPage };
