import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useCreateSpendingModelMutation, useDeleteSpendingModelMutation, useGetSpendingModelListQuery } from "@/services/admin/spendingModel";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_MODEL_CONSTANT } from "../model.constant";
import { TEXT_TRANSLATE } from "../model.translate";

const useSpendingModelManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [createModel, { isLoading: isCreatingModel }] = useCreateSpendingModelMutation();
  const [deleteModel] = useDeleteSpendingModelMutation();

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingModelList } = useGetSpendingModelListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_MODEL_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  const handleAddModel = async () => {
    try {
      const values = await form.validateFields();
      
      try {
        await createModel(values).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err.data;
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

  const handleDeleteModel = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteModel(id);
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  return {
    state: {
      data,
      isLoadingModelList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingModel,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddModel,
      handleCancel,
      handleDeleteModel,
    },
  };
};

export { useSpendingModelManagementPage };
