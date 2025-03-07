"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useCategoryManagementPage } from "../hooks/useCategoryManagementPage";

const AddCategoryModal = () => {
  const { TextArea } = Input;

  const { handler, state } = useCategoryManagementPage();
  const categoryFields = [
    {
      name: state.FORM_NAME.NAME,
      label: state.TITLE.NAME,
      component: (
        <Input prefix={<MailOutlined />} placeholder={state.TITLE.NAME} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.CODE,
      label: state.TITLE.CODE,
      component: (
        <Input prefix={<UserOutlined />} placeholder={state.TITLE.CODE} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.ICON,
      label: state.TITLE.ICON,
      component: (
        <Input prefix={<UserOutlined />} placeholder={state.TITLE.ICON} />
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
      title={<p className="text-lg font-bold text-primary">Thêm danh mục</p>}
      open={state.isOpen}
      onOk={handler.handleAddCategory}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.ADD_CATEGORY}
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isCreatingCategory}
      okButtonProps={{ className: "custom-ok-button" }}
    >
      <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
    </Modal>
  );
};

export { AddCategoryModal };
