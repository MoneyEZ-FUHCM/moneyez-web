"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import {
  MailOutlined,
  SignatureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";

const AddSpendingModelModal = () => {
  const { TextArea } = Input;

  const { handler, state } = useSpendingModelManagementPage();
  const categoryFields = [
    {
      name: state.FORM_NAME.NAME,
      label: state.TITLE.NAME,
      component: (
        <Input prefix={<SignatureOutlined />} placeholder={state.TITLE.NAME} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.DESCRIPTION,
      label: state.TITLE.DESCRIPTION,
      component: (
        <TextArea rows={4} placeholder={state.TITLE.DESCRIPTION} required />
      ),
      rules: [
        {
          required: true,
          message: state.MESSAGE_VALIDATE.DESCRIPTION_REQUIRED,
        },
      ],
    },
  ];

  return (
    <Modal
      title={
        <p className="text-lg font-bold text-primary">Thêm mô hình chi tiêu</p>
      }
      open={state.isOpen}
      onOk={handler.handleAddModel}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.ADD_MODEL}
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isCreatingModel}
      okButtonProps={{ className: "custom-ok-button" }}
    >
      <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
    </Modal>
  );
};

export { AddSpendingModelModal };
