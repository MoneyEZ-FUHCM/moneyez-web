"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { CommonForm } from "@/components/common/table/CommonForm";
import { ButtonCustom } from "@/components/ui/button";
import { useGetCategoryListQuery } from "@/services/admin/category";
import {
  useGetSpendingModelIdQuery,
  useUpdateSpendingModelMutation,
} from "@/services/admin/spendingModel";
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  FileTextOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
  Divider,
  Tooltip,
  Progress,
  Empty,
} from "antd";

import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { TEXT_TRANSLATE } from "../model.translate";
import { CategoryCard } from "./CategoryCard";

const { Title, Text, Paragraph } = Typography;

const SpendingModelDetail = () => {
  const { id } = useParams();
  const { TITLE } = TEXT_TRANSLATE;
  const { state, handler } = useSpendingModelManagementPage();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // API Queries
  const {
    data: spendingModel,
    isLoading,
    refetch,
  } = useGetSpendingModelIdQuery(id as string);

  const [updateSpendingModel] = useUpdateSpendingModelMutation();

  const { data: categories } = useGetCategoryListQuery({
    PageIndex: 1,
    PageSize: 50,
    search: "",
  });

  useEffect(() => {
    if (spendingModel?.data?.spendingModelCategories) {
      const total = spendingModel.data.spendingModelCategories.reduce(
        (sum, item) => sum + item.percentageAmount,
        0,
      );
      setTotalPercentage(total);
    }
  }, [spendingModel?.data?.spendingModelCategories]);

  const filteredCategories =
    spendingModel?.data?.spendingModelCategories.filter(
      (category) =>
        state.selectedType === "ALL" ||
        category.category.type === state.selectedType,
    );

  // Available categories for adding to model
  const availableCategories = useMemo(() => {
    if (!categories?.items || !spendingModel?.data?.spendingModelCategories)
      return [];

    const existingCategoryIds = new Set(
      spendingModel.data.spendingModelCategories.map((item) => item.categoryId),
    );

    return categories.items.filter(
      (category) => !existingCategoryIds.has(category.id),
    );
  }, [categories?.items, spendingModel?.data?.spendingModelCategories]);

  const categoryFields = [
    {
      name: "categoryId",
      label: "Danh mục",
      component: (
        <Select
          placeholder="Chọn danh mục"
          optionLabelProp="label"
          className="w-full"
          showSearch
          filterOption={(input, option) =>
            (option?.label?.props?.children[1]?.props?.children || "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={availableCategories.map((cat) => ({
            label: (
              <div className="flex items-center gap-2">
                <span className="flex items-center text-primary">
                  {renderIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <Tag color={cat.type === "INCOME" ? "green" : "red"}>
                  {cat.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
                </Tag>
              </div>
            ),
            value: cat.id,
          }))}
          optionRender={(option) => option.label}
        />
      ),
      rules: [{ required: true, message: "Vui lòng chọn danh mục" }],
    },
    {
      name: "percentageAmount",
      label: "Phần trăm",
      component: (
        <InputNumber
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          className="w-full"
          addonAfter={<PercentageOutlined />}
        />
      ),
      rules: [{ required: true, message: "Vui lòng nhập phần trăm" }],
    },
  ];

  const breadcrumbItems = [
    {
      href: "/admin/manage-model",
      title: TITLE.MANAGE_MODEL,
    },
    {
      title: TITLE.MANAGE_MODEL_DETAIL,
    },
  ];

  // Effects
  useEffect(() => {
    if (spendingModel?.data) {
      form.setFieldsValue({
        name: spendingModel.data.name,
        description: spendingModel.data.description || "",
      });
    }
  }, [spendingModel?.data, form]);

  // Handlers
  const handleUpdateModel = async () => {
    try {
      const values = await form.validateFields();

      if (!values.description?.trim()) {
        form.setFields([
          {
            name: "description",
            errors: ["Vui lòng nhập mô tả"],
          },
        ]);
        return;
      }

      await updateSpendingModel({
        id: id as string,
        name: values.name,
        description: values.description,
        isTemplate: spendingModel?.data?.isTemplate,
      }).unwrap();

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to update model:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin mô hình..." />
      </div>
    );
  }

  // Get progress status
  const getProgressStatus = () => {
    if (totalPercentage === 0) return "exception";
    if (totalPercentage < 100) return "active";
    if (totalPercentage === 100) return "success";
    return "exception";
  };

  return (
    <TableListLayout
      title={state.TITLE.MANAGE_MODEL_DETAIL}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="min-h-screen p-6">
        <div className="mx-auto mb-8 max-w-4xl rounded-lg bg-white p-8 shadow-md transition-shadow hover:shadow-lg">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Tag
                color={spendingModel?.data?.isTemplate ? "green" : "blue"}
                className="px-3 py-1 text-sm font-medium"
              >
                {spendingModel?.data?.isTemplate ? "Mẫu mặc định" : "Tùy chỉnh"}
              </Tag>
            </div>

            {!isEditing && (
              <ButtonCustom
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90 hover:shadow"
              >
                <EditOutlined /> Chỉnh sửa
              </ButtonCustom>
            )}
          </div>

          {isEditing ? (
            <Form form={form} layout="vertical" className="space-y-6">
              <Form.Item
                name="name"
                label={
                  <span className="text-base font-medium">Tên mô hình</span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập tên mô hình" },
                ]}
              >
                <Input
                  className="rounded-md border-gray-300 text-xl font-bold focus:border-primary"
                  placeholder="Nhập tên mô hình"
                  prefix={<FileTextOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <span className="text-base font-medium">Mô tả chi tiết</span>
                }
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <ReactQuill
                  theme="snow"
                  className="rounded-md border-gray-300 focus:border-primary"
                  onChange={(content) => {
                    form.setFieldsValue({ description: content });
                    if (!content.trim()) {
                      form.setFields([
                        {
                          name: "description",
                          errors: ["Vui lòng nhập mô tả"],
                        },
                      ]);
                    }
                  }}
                  placeholder="Nhập mô tả chi tiết về mô hình này..."
                />
              </Form.Item>

              <div className="flex justify-end gap-3">
                <ButtonCustom
                  onClick={() => setIsEditing(false)}
                  className="rounded-md !border !border-red !bg-white px-4 py-2 text-red transition-all"
                >
                  Hủy
                </ButtonCustom>

                <ButtonCustom
                  onClick={handleUpdateModel}
                  className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
                >
                  <SaveOutlined /> Lưu thay đổi
                </ButtonCustom>
              </div>
            </Form>
          ) : (
            <div className="prose max-w-none">
              <Title
                level={2}
                className="mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-3xl font-bold text-transparent"
              >
                {spendingModel?.data?.name}
              </Title>

              <Divider className="my-6" />

              <div className="mt-6 text-gray-600">
                {parse(spendingModel?.data?.description as string)}
              </div>
            </div>
          )}
        </div>

        {/* Allocation Summary */}
        <div className="mx-auto mb-8 max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <Title level={4} className="m-0">
                Phân bổ ngân sách
              </Title>
              <Tooltip
                title={
                  totalPercentage === 100
                    ? "Đã phân bổ đủ 100%"
                    : "Chưa phân bổ đủ 100%"
                }
              >
                <Tag
                  color={totalPercentage === 100 ? "success" : "warning"}
                  className="px-3 py-1"
                >
                  {totalPercentage}%
                </Tag>
              </Tooltip>
            </div>

            <Progress
              percent={totalPercentage}
              status={getProgressStatus()}
              strokeWidth={10}
              className="mb-2"
            />

            <Text type="secondary" className="text-sm">
              {totalPercentage === 100
                ? "Đã phân bổ đủ 100% ngân sách"
                : totalPercentage > 100
                  ? "Đã phân bổ vượt quá 100%, vui lòng điều chỉnh"
                  : `Còn ${(100 - totalPercentage).toFixed(1)}% chưa được phân bổ`}
            </Text>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mx-auto">
          <div className="mb-6 flex flex-col gap-4 rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Radio.Group
                value={state.selectedType}
                onChange={(e) => handler.setSelectedType(e.target.value)}
                buttonStyle="solid"
                className="radio-group-custom"
                size="middle"
              >
                <Radio.Button value="ALL" className="font-medium">
                  Tất cả
                </Radio.Button>
                <Radio.Button value="INCOME" className="font-medium">
                  Thu nhập
                </Radio.Button>
                <Radio.Button value="EXPENSE" className="font-medium">
                  Chi tiêu
                </Radio.Button>
              </Radio.Group>
            </div>

            <Tooltip title="Thêm danh mục vào mô hình">
              <ButtonCustom
                className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90 hover:shadow-md"
                onClick={handler.handleOpenModalAdd}
                disabled={availableCategories.length === 0}
              >
                <PlusOutlined /> Thêm danh mục
              </ButtonCustom>
            </Tooltip>
          </div>

          <Row gutter={[16, 16]}>
            {filteredCategories?.length ? (
              filteredCategories.map((category) => (
                <Col key={category.categoryId} xs={24} sm={12} lg={8} xl={6}>
                  <CategoryCard
                    spendingModelId={id as string}
                    category={category.category}
                    percentageAmount={category.percentageAmount}
                    onRemove={() =>
                      handler.handleRemoveSpendingModelCategory(
                        id as string,
                        category.categoryId,
                        refetch,
                      )
                    }
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 shadow-sm">
                  <Empty
                    description={
                      <Text className="text-gray-500">
                        Chưa có danh mục nào được thêm vào mô hình này
                      </Text>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                  <ButtonCustom
                    className="mt-4 flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
                    onClick={handler.handleOpenModalAdd}
                    disabled={availableCategories.length === 0}
                  >
                    <PlusOutlined /> Thêm danh mục ngay
                  </ButtonCustom>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            Thêm danh mục vào mô hình
          </div>
        }
        open={state.isOpen}
        onOk={() => handler.handleAddModelCategory(id as string, refetch)}
        onCancel={handler.handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          className:
            totalPercentage < 100
              ? "bg-primary text-white hover:bg-primary/90"
              : "",
          disabled: totalPercentage >= 100,
        }}
        cancelButtonProps={{
          className: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        }}
        centered
        maskClosable={false}
        destroyOnClose
      >
        <Paragraph className="mb-4 text-gray-500">
          Chọn danh mục và nhập phần trăm phân bổ cho danh mục này.
        </Paragraph>
        <div className="rounded-lg p-4">
          <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            <Text strong>
              <span className="text-red">*</span> Lưu ý:
            </Text>{" "}
            Tổng phần trăm phân bổ hiện tại là {totalPercentage}%.
            {totalPercentage < 100
              ? ` Bạn cần phân bổ thêm ${(100 - totalPercentage).toFixed(1)}%.`
              : totalPercentage > 100
                ? " Phân bổ đã vượt quá 100%, vui lòng điều chỉnh."
                : " Đã phân bổ đủ 100%."}
          </div>
        </div>
      </Modal>
    </TableListLayout>
  );
};

export { SpendingModelDetail };
