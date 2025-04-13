import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import {
  clearPostData,
  clearSystemData,
  setPostData,
  setSystemData,
} from "@/redux/slices/systemSlice";
import { RootState } from "@/redux/store";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostListQuery,
  useUpdatePostMutation,
} from "@/services/admin/post";
import { SubCategory } from "@/types/category.types";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_POST_CONSTANT } from "../post.constant";
import { TEXT_TRANSLATE } from "../post.translate";
import { Post } from "@/types/post.types";

const usePostManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_POST_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [fileChange, setFileChange] = useState<string>("");

  const handleFileChange = useCallback((newFileChange: string) => {
    setFileChange(newFileChange);
  }, []);

  const post = useSelector((state: RootState) => state.system.post);

  const { data, isLoading: isLoadingPostList } = useGetPostListQuery(
    useMemo(
      () => ({
        PageIndex: pageIndex,
        PageSize: pageSize,
        search: searchQuery || "",
      }),
      [pageIndex, pageSize, searchQuery],
    ),
  );

  useEffect(() => {
    if (data?.totalPages && pageIndex > data.totalPages) {
      setPageIndex(data.totalPages);
    }
  }, [data?.totalPages, pageIndex]);

  const handleSubmitForm = useCallback(async () => {
    try {
      const values = await form.validateFields();
      try {
        if (post) {
          await updatePost({ id: post.id, ...values }).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.UPDATE_SUCCESSFUL);
        } else {
          await createPost(values).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        }
        form.resetFields();
        dispatch(clearPostData());
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.DUPLICATE_SUB_CATE_NAME) {
          return showToast(
            TOAST_STATUS.ERROR,
            MESSAGE_ERROR.POST_ALREADY_EXISTS,
          );
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
      }
    } catch (err: any) {
      dispatch(setIsOpen(true));
    }
  }, [form, post, updatePost, createPost, dispatch]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    dispatch(clearPostData());
    dispatch(setIsOpen(false));
  }, [dispatch, form]);

  const handleOpenModalAdd = useCallback(() => {
    form.resetFields();
    dispatch(clearPostData());
    dispatch(setIsOpen(true));
  }, [dispatch, form]);

  const handleOpenModalEdit = (record: Post) => {
    dispatch(setPostData(record));
    dispatch(setIsOpen(true));
  };

  const handlePageChange = useCallback((pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  }, []);

  const handleDeletePost = useCallback(
    (id: string) => {
      confirm({
        title: TITLE.TITLE,
        content: TITLE.CONTENT_CONFIRM,
        okText: TITLE.OK_TEXT,
        okType: "danger",
        cancelText: TITLE.CANCEL_TEXT,
        onOk: async () => {
          try {
            await deletePost(id).unwrap();
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
          } catch (err: any) {
            const error = err?.data;
            if (error?.errorCode === ERROR_CODE.SUB_CATEGORY_NOT_EXIST) {
              return showToast(
                TOAST_STATUS.ERROR,
                MESSAGE_ERROR.POST_NOT_EXISTS,
              );
            }
            if (error?.errorCode === ERROR_CODE.SUBCATEGORY_HAS_DEPENDENCIES) {
              return showToast(
                TOAST_STATUS.ERROR,
                "Danh mục chi tiêu con đang được sử dụng. Không thể xóa",
              );
            }
            showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
          }
        },
      });
    },
    [confirm, deletePost],
  );
  useEffect(() => {
    form.setFieldsValue({ thumbnail: fileChange });
  }, [fileChange, form]);

  useEffect(() => {
    if (isOpen && post) {
      form.setFieldsValue(post);
      setFileChange(post.thumbnail || "");
    }
  }, [form, isOpen, post]);

  return {
    state: {
      data,
      isLoadingPostList,
      pageIndex,
      pageSize,
      isOpen,
      isSubmitting: isCreating || isUpdating,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      post,
      fileChange,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleOpenModalEdit,
      handleSubmitForm,
      handleCancel,
      handleDeletePost,
      setSearchQuery,
      handleFileChange,
    },
  };
};

export { usePostManagementPage };
