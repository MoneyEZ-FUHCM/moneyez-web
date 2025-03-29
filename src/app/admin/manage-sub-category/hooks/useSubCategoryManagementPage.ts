import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoryListQuery,
} from "@/services/admin/subCategory";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_SUB_CATEGORY_CONSTANT } from "../subCategory.constant";
import { TEXT_TRANSLATE } from "../subCategory.translate";

const useSubCategoryManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const [createSubCategory, { isLoading: isCreatingSubCategory }] =
    useCreateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingCategoryList } = useGetSubCategoryListQuery(
    {
      PageIndex: pageIndex,
      PageSize: pageSize,
      search: searchQuery,
    },
  );

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_SUB_CATEGORY_CONSTANT;
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

  const handleAddSubCategory = async () => {
    try {
      const values = await form.validateFields();
      console.log("check values", values);
      try {
        await createSubCategory([values]).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.DUPLICATE_SUB_CATE_NAME) {
          showToast(
            TOAST_STATUS.ERROR,
            TEXT_TRANSLATE.MESSAGE_ERROR.SUB_CATEGORY_ALREADY_EXISTS,
          );
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

  const handleDeleteSubCategory = (id: string) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteSubCategory(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.SUB_CATEGORY_NOT_EXIST) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.SUB_CATEGORY_NOT_EXISTS,
            );
            return;
          }
          if (error?.errorCode === ERROR_CODE.SUBCATEGORY_HAS_DEPENDENCIES) {
            showToast(
              TOAST_STATUS.ERROR,
              "Danh mục chi tiêu con đang được sử dụng. Không thể xóa",
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
      isCreatingSubCategory,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddSubCategory,
      handleCancel,
      handleDeleteSubCategory,
      setSearchQuery,
    },
  };
};

export { useSubCategoryManagementPage };
