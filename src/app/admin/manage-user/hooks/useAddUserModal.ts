import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatDateRequest } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { useCreateUserMutation } from "@/services/admin/user";
import { Form } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_USER_CONSTANT } from "../user.constant";
import { TEXT_TRANSLATE } from "../user.translate";

const useAddUserModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [fileChange, setFileChange] = useState<string>("");
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_USER_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  useEffect(() => {
    form.setFieldsValue({ avatar: fileChange });
  }, [fileChange, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = formatDateRequest(values.dob);
      const updatedValues = JSON.stringify({ ...values, dob: formattedDate });

      try {
        await createUser(updatedValues).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err.data;

        if (error.errorCode === ERROR_CODE.USER_MUST_16) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.MUST_BE_16);
          dispatch(setIsOpen(true));
          return;
        }

        if (error.errorCode === ERROR_CODE.ACCOUNT_VERIFIED) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.VERIFIED_EMAIL);
          dispatch(setIsOpen(true));
          return;
        }

        if (error.errorCode === ERROR_CODE.DUPLICATE_PHONE_NUMBER) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.PHONE_ALREADY_EXISTED);
          dispatch(setIsOpen(true));
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

  const disabledDate = (current: object) =>
    current && current > moment().startOf("day");

  const handleFileChange = useCallback((newFileChange: string) => {
    setFileChange(newFileChange);
  }, []);

  return {
    state: {
      disabledDate,
      isCreatingUser,
      MESSAGE_VALIDATE,
      isOpen,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
    },
    handler: {
      handleFileChange,
      handleOk,
      handleCancel,
    },
  };
};

export { useAddUserModal };
