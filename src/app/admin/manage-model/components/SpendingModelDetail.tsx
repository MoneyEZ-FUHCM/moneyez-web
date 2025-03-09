"use client";

import { TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { CommonForm } from "@/components/common/table/CommonForm";
import { ButtonCustom } from "@/components/ui/button";
import { useGetCategoryListQuery } from "@/services/admin/category";
import { useGetSpendingModelIdQuery } from "@/services/admin/spendingModel";
import { PlusOutlined } from "@ant-design/icons";
import { Col, InputNumber, Modal, Radio, Row, Select, Spin, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { TEXT_TRANSLATE } from "../model.translate";
import { CategoryCard } from "./CategoryCard";

const { Title, Text } = Typography;

const SpendingModelDetail = () => {
  const { id } = useParams();
  const { TITLE } = TEXT_TRANSLATE;
  const { state, handler } = useSpendingModelManagementPage();

  const {
    data: spendingModel,
    isLoading,
    refetch,
  } = useGetSpendingModelIdQuery(id as string);

  const { data: categories, } = useGetCategoryListQuery({
    PageIndex: 1,
    PageSize: 50,
    search: "",
  });

  const filteredCategories =
    spendingModel?.data?.spendingModelCategories.filter(
      (category) =>
        state.selectedType === "ALL" ||
        category.category.type === state.selectedType,
    );

  // Add this new memo to filter available categories
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
        <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spin />
      </div>
    );
  }

  return (
    <TableListLayout
      title={state.TITLE.MANAGE_MODEL_DETAIL}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={2}>{spendingModel?.data?.name}</Title>
          <Text className="mb-4 block text-gray-600">
            {spendingModel?.data?.description}
          </Text>
          <Tag color={spendingModel?.data?.isTemplate ? "green" : "blue"}>
            {spendingModel?.data?.isTemplate ? "Mẫu mặc định" : "Tùy chỉnh"}
          </Tag>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Radio.Group
            value={state.selectedType}
            onChange={(e) => handler.setSelectedType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">Tất cả</Radio.Button>
            <Radio.Button value="INCOME">Thu nhập</Radio.Button>
            <Radio.Button value="EXPENSE">Chi tiêu</Radio.Button>
          </Radio.Group>

          <ButtonCustom
            className="bg-primary text-white"
            onClick={handler.handleOpenModalAdd}
          >
            <PlusOutlined className="mr-1" />
            Thêm danh mục
          </ButtonCustom>
        </div>

        <Row gutter={[16, 16]}>
          {filteredCategories?.map((category) => (
            <Col key={category.categoryId} xs={24} sm={12} lg={8}>
              <CategoryCard
                spendingModelId={id as string}
                category={category.category}
                percentageAmount={category.percentageAmount}
                onRemove={() =>
                  handler.handleRemoveSpendingModelCategory(
                    id as string,
                    category.categoryId,
                    refetch
                  )
                }
              />
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title={
          <p className="text-lg font-bold text-primary">
            Thêm danh mục vào mô hình
          </p>
        }
        open={state.isOpen}
        onOk={() => handler.handleAddModelCategory(id as string, refetch)}
        onCancel={handler.handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{ className: "custom-ok-button" }}
      >
        <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
      </Modal>
    </TableListLayout>
  );
};

export { SpendingModelDetail };

