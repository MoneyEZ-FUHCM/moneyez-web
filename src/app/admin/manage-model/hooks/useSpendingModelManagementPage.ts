import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen, setPlainText } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useAddCategoryModalToSpendingModelMutation,
  useCreateSpendingModelMutation,
  useDeleteSpendingModelMutation,
  useGetSpendingModelListQuery,
  useRemovecategoryFromSpendingModelMutation,
} from "@/services/admin/spendingModel";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_MODEL_CONSTANT } from "../model.constant";
import { TEXT_TRANSLATE } from "../model.translate";

const useSpendingModelManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [createModel, { isLoading: isCreatingModel }] =
    useCreateSpendingModelMutation();
  const [
    addCategoryModalToSpendingModel,
    { isLoading: isAddCategoryModalToSpendingModel },
  ] = useAddCategoryModalToSpendingModelMutation();
  const [deleteModel] = useDeleteSpendingModelMutation();
  const [removecategoryFromSpendingModel] =
    useRemovecategoryFromSpendingModelMutation();

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingModelList } = useGetSpendingModelListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const plainText = useSelector((state: RootState) => state.modal.plainText);

  const { SYSTEM_ERROR, CONDITION } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_MODEL_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  const [selectedType, setSelectedType] = useState<string>("ALL");

  const handleAddModel = async () => {
    try {
      const values = await form.validateFields();
      const updateValue = [{ ...values, isTemplate: CONDITION.TRUE }];
      if (!plainText.trim()) {
        showToast(TOAST_STATUS.INFO, "Vui lòng nhập mô tả");
        return;
      }
      try {
        await createModel(updateValue).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
        dispatch(setPlainText(""));
      } catch (err: any) {
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

  const handleViewDetail = useCallback((record: any) => {
    router.push(`/admin/manage-model/${record.id}`);
  }, []);

  const handleDeleteModel = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteModel(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
            );
            return;
          }
          if (error?.errorCode === ERROR_CODE.MODEL_HAS_DEPENDENCIES) {
            showToast(
              TOAST_STATUS.ERROR,
              "Mô hình đang được sử dụng. Không thể xóa ở thời điểm hiện tại",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleAddModelCategory = async (
    modelId: string,
    refetch: () => void,
  ) => {
    try {
      const values = await form.validateFields();
      const requestData = {
        spendingModelId: modelId,
        categories: [
          {
            categoryId: values.categoryId,
            percentageAmount: values.percentageAmount,
          },
        ],
      };
      try {
        await addCategoryModalToSpendingModel(requestData).unwrap();
        showToast(TOAST_STATUS.SUCCESS, "Thêm danh mục thành công");
        form.resetFields();
        dispatch(setIsOpen(false));
        refetch();
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.MODEL_CATE_ALREADY_ADDED) {
          showToast(
            TOAST_STATUS.ERROR,
            TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_CATE_ALREADY_ADDED,
          );
          return;
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        dispatch(setIsOpen(true));
      }
    } catch (err: any) {
      dispatch(setIsOpen(true));
    }
  };

  const handleRemoveSpendingModelCategory = useCallback(
    async (modelId: string, categoryId: string, refetch: () => void) => {
      confirm({
        title: TITLE.TITLE,
        content: TITLE.CONTENT,
        okText: TITLE.OK_TEXT,
        okType: "danger",
        cancelText: TITLE.CANCEL_TEXT,
        onOk: async () => {
          try {
            const requestData = {
              spendingModelId: modelId,
              categoryIds: [categoryId],
            };
            await removecategoryFromSpendingModel(requestData).unwrap();
            refetch();
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
          } catch (err: any) {
            const error = err?.data;
            if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
              showToast(
                TOAST_STATUS.ERROR,
                TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
              );
              return;
            }
            showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
          }
        },
      });
    },
    [],
  );

  const handleViewDetailCategory = useCallback((record: string) => {
    router.push(`/admin/manage-category/${record}`);
  }, []);

  return {
    state: {
      data,
      isLoadingModelList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingModel,
      isAddCategoryModalToSpendingModel,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      selectedType,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddModel,
      handleCancel,
      handleDeleteModel,
      handleViewDetail,
      handleAddModelCategory,
      setSelectedType,
      handleRemoveSpendingModelCategory,
      handleViewDetailCategory,
      dispatch,
    },
  };
};

export { useSpendingModelManagementPage };
