import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { clearSystemData } from "@/redux/slices/systemSlice";
import { RootState } from "@/redux/store";
import {
  useDeleteKnowledgeMutation,
  useGetKnowledgeListQuery,
  useUploadKnowledgeMutation,
} from "@/services/admin/knowledge";
import { Form, message, Modal, TablePaginationConfig, Upload } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KNOWLEDGE_CONSTANT } from "../Knowledge.constant";
import TEXT_TRANSLATE from "../Knowledge.translate";

const useKnowledgeManagement = () => {
  const confirm = Modal.confirm;
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ERROR_CODE } = KNOWLEDGE_CONSTANT;
  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const {
    data: knowLedgeList,
    isLoading: isLoadingKnowledgeList,
    refetch,
  } = useGetKnowledgeListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const [uploadFile, { isLoading: isUploading }] = useUploadKnowledgeMutation();
  const [deleteFile] = useDeleteKnowledgeMutation();

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleOpenModalAdd = useCallback(() => {
    form.resetFields();
    setFileList([]);
    dispatch(clearSystemData());
    dispatch(setIsOpen(true));
  }, [dispatch, form]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setFileList([]);
    dispatch(clearSystemData());
    dispatch(setIsOpen(false));
  }, [dispatch, form]);

  const isWordFile = (file: RcFile): boolean => {
    const wordMimeTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return wordMimeTypes.includes(file.type);
  };

  const beforeUpload = (file: RcFile) => {
    const isValidFileType = isWordFile(file);

    if (!isValidFileType) {
      showToast(TOAST_STATUS.INFO, "Chỉ hỗ trợ tải lên tệp Word");
      return Upload.LIST_IGNORE;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      showToast(TOAST_STATUS.INFO, "Tệp phải nhỏ hơn 10MB");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    const filteredFileList = newFileList.filter((file) => {
      if (file.originFileObj) {
        return isWordFile(file.originFileObj as RcFile);
      }
      return true;
    });

    setFileList(filteredFileList);
  };

  const handleSubmitForm = useCallback(async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();

      if (fileList.length === 0) {
        message.error("Vui lòng chọn tệp để tải lên!");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("formData", formValues.formData);

      const file = fileList[0].originFileObj;
      if (file) {
        formData.append("file", file);
      }
      await uploadFile(formData).unwrap();
      message.success("Tải lên tài liệu thành công!");
      dispatch(setIsOpen(false));
      form.resetFields();
      setFileList([]);
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, fileList, dispatch, uploadFile, refetch]);

  const handleDeleteFile = useCallback((id: number) => {
    confirm({
      title: TEXT_TRANSLATE.TITLE.TITLE,
      content: TEXT_TRANSLATE.TITLE.CONTENT,
      okText: TEXT_TRANSLATE.TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TEXT_TRANSLATE.TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteFile(id).unwrap();
          showToast(
            TOAST_STATUS.SUCCESS,
            TEXT_TRANSLATE.MESSAGE_SUCCESS.DELETE_SUCCESSFUL,
          );
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.FILE_NOT_EXIST) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.FILE_NOT_FOUND,
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  }, []);

  return {
    state: {
      knowLedgeList,
      isLoadingKnowledgeList,
      pageSize,
      pageIndex,
      form,
      isOpen,
      fileList,
      isSubmitting: isSubmitting || isUploading,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleCancel,
      handleSubmitForm,
      beforeUpload,
      handleFileChange,
      handleDeleteFile,
    },
  };
};

export { useKnowledgeManagement };
