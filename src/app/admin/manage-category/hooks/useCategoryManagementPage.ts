import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryListQuery,
} from "@/services/admin/category";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_CATEGORY_CONSTANT } from "../category.constant";
import { TEXT_TRANSLATE } from "../category.translate";

const useCategoryManagementPage = () => {
  const confirm = Modal.confirm;
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingCategoryList } = useGetCategoryListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    search: searchQuery,
  });

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_CATEGORY_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  useEffect(() => {
    if (data) {
      const totalPages = data?.totalPages || 1;
      if (pageIndex > totalPages) {
        setPageIndex(totalPages);
      }
    }
  }, [data?.totalPages]);

  const handleViewDetail = useCallback((record: any) => {
    router.push(`/admin/manage-category/${record.id}`);
  }, []);

  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      try {
        await createCategory([values]).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.CATEGORY_ALREADY_EXISTS) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.CATEGORY_ALREADY_EXISTS);
          return;
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        dispatch(setIsOpen(true));
      }
    } catch (err) {
      dispatch(setIsOpen(true));
    }
  };

  const handleCancel = () => {
    dispatch(setIsOpen(false));
    form.resetFields();
  };

  const handleOpenModalAdd = useCallback(() => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleDeleteCategory = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.CATEGORY_NOT_EXIST) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.CATEGORY_NOT_EXISTS,
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  return {
    state: {
      data,
      isLoadingCategoryList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingCategory,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddCategory,
      handleCancel,
      handleDeleteCategory,
      handleViewDetail,
      setSearchQuery,
    },
  };
};

export { useCategoryManagementPage };
