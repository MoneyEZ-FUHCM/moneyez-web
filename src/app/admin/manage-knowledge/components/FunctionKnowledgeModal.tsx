"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import { InboxOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useKnowledgeManagement } from "../hooks/useKnowledgeManagement";

const FunctionKnowledgeModal = () => {
  const { state, handler } = useKnowledgeManagement();
  const { Dragger } = Upload;

  const categoryFields = [
    {
      name: "formData",
      label: "",
      component: (
        <div className="mt-5">
          <Dragger
            name="file"
            beforeUpload={handler.beforeUpload}
            onChange={handler.handleFileChange}
            fileList={state.fileList}
            maxCount={1}
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple={false}
            className="w-full"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Kéo thả tệp vào đây hoặc nhấn để chọn
            </p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ định dạng .doc và .docx, dung lượng &lt; 10MB
            </p>
          </Dragger>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={<p className="text-lg font-bold text-primary">Thêm tài liệu</p>}
      open={state.isOpen}
      onOk={handler.handleSubmitForm}
      onCancel={handler.handleCancel}
      okText={"Xác nhận"}
      cancelText={"Hủy"}
      confirmLoading={state.isSubmitting}
      okButtonProps={{ className: "custom-ok-button" }}
      destroyOnClose
    >
      <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
    </Modal>
  );
};

export { FunctionKnowledgeModal };
