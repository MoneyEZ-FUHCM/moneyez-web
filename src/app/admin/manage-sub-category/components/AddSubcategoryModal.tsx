"use client";

import {
  DeleteOutlined,
  MailOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useSubCategoryManagementPage } from "../hooks/useSubCategoryManagementPage";

const AddSubCategoryModal = () => {
  const { TextArea } = Input;

  const { handler, state } = useSubCategoryManagementPage();

  return (
    <Modal
      title={
        <p className="text-lg font-bold text-primary">Thêm danh mục phụ</p>
      }
      open={state.isOpen}
      onOk={handler.handleAddSubCategory}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.ADD_CATEGORY}
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isCreatingSubCategory}
      okButtonProps={{ className: "custom-ok-button" }}
      width={800}
    >
      <Form
        form={state.form}
        layout="vertical"
        initialValues={{ subCategories: [{}] }}
      >
        <Form.List name="subCategories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 16, width: "100%" }}>
                  <Row gutter={[16, 0]}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Tên danh mục"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên danh mục",
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="Tên danh mục"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "code"]}
                        label="Mã danh mục"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mã danh mục",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Mã danh mục"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "icon"]}
                        label="Icon"
                        rules={[
                          { required: true, message: "Vui lòng nhập icon" },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Icon" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Mô tả"
                    style={{ width: "100%" }}
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  >
                    <TextArea rows={2} placeholder="Mô tả danh mục" />
                  </Form.Item>

                  <div style={{ textAlign: "right" }}>
                    {fields.length > 1 && (
                      <Button
                        type="dashed"
                        danger
                        onClick={() => remove(name)}
                        icon={<DeleteOutlined />}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm danh mục phụ
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export { AddSubCategoryModal };
