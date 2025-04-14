"use client";

import { UploadImage } from "@/components";
import { CommonForm } from "@/components/common/table/CommonForm";
import { ProfileOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { usePostManagementPage } from "../hooks/usePostManagement";
import { TEXT_TRANSLATE } from "../post.translate";

const FunctionPostModal = () => {
  const { TextArea } = Input;
  const { handler, state } = usePostManagementPage();

  const postFields = [
    {
      name: state.FORM_NAME.TITLE,
      label: state.TITLE.CODE,
      component: (
        <Input
          prefix={<UnorderedListOutlined />}
          placeholder={state.TITLE.NAME}
        />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.SHORT_CONTENT,
      label: state.TITLE.SHORT_CONTENT,
      component: (
        <Input prefix={<ProfileOutlined />} placeholder={state.TITLE.CODE} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.CONTENT,
      label: state.TITLE.CONTENT,
      isRequired: true,
      component: (
        <ReactQuill
          className="rounded-md border-gray-300 focus:border-primary"
          placeholder="Nhập mô tả chi tiết về bài viết này..."
        />
      ),
    },
    {
      name: state.FORM_NAME.THUMBNAIL,
      label: state.TITLE.THUMBNAIL,
      component: (
        <UploadImage
          onFileChange={handler.handleFileChange}
          titleButton={"Thêm ảnh"}
          initialImage={state.post ? state.fileChange : ""}
        />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.IMAGE_REQUIRED },
      ],
    },
  ];

  return (
    <Modal
      width={800}
      title={
        <p className="text-lg font-bold text-primary">
          {state.post
            ? TEXT_TRANSLATE.TITLE.UPDATE_POST
            : TEXT_TRANSLATE.TITLE.ADD_POST}
        </p>
      }
      open={state.isOpen}
      onOk={handler.handleSubmitForm}
      onCancel={handler.handleCancel}
      okText={
        state.post
          ? TEXT_TRANSLATE.BUTTON.UPDATE_POST
          : TEXT_TRANSLATE.BUTTON.ADD_POST
      }
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isSubmitting}
      okButtonProps={{ className: "custom-ok-button" }}
      destroyOnClose
    >
      <CommonForm colSpan={24} form={state.form} fields={postFields} />
    </Modal>
  );
};

export { FunctionPostModal };
