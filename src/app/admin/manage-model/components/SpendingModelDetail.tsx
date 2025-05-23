"use client";

import { TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { ButtonCustom } from "@/components/ui/button";
import { CATEGORY_TYPE_TEXT } from "@/helpers/enums/globals";
import {
  CategoryFormListProps,
  SpendingModel,
} from "@/helpers/types/spendingModel.types";
import {
  EditOutlined,
  FileTextOutlined,
  PercentageOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { TEXT_TRANSLATE } from "../model.translate";
import { CategoryCard } from "./CategoryCard";
import { stat } from "fs";

const { Title, Text } = Typography;

const CategoryFormList: React.FC<CategoryFormListProps> = ({
  form,
  availableCategories,
  hasExistingCategories = false,
}) => {
  return (
    <Form form={form} layout="vertical" name="categoryFormList">
      <Form.List name="categories">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                className="relative mb-4 rounded border p-4 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Item
                    {...restField}
                    name={[name, "categoryId"]}
                    label="Danh mục"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      optionLabelProp="label"
                      showSearch
                      className="w-full"
                      filterOption={(input, option) =>
                        (
                          option?.label?.props?.children[1]?.props?.children ||
                          ""
                        )
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={availableCategories.map((cat) => ({
                        label: (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center text-primary">
                              {renderIcon(cat.icon)}
                            </span>
                            <span>{cat?.name}</span>
                            <Tag
                              color={
                                cat.type === CATEGORY_TYPE_TEXT.INCOME
                                  ? "green"
                                  : "red"
                              }
                            >
                              {cat.type === CATEGORY_TYPE_TEXT.INCOME
                                ? "Thu nhập"
                                : "Chi tiêu"}
                            </Tag>
                          </div>
                        ),
                        value: cat.id,
                      }))}
                      optionRender={(option) => option.label}
                    />
                  </Form.Item>
                  {!hasExistingCategories && (
                    <Form.Item
                      {...restField}
                      name={[name, "percentageAmount"]}
                      label="Phần trăm"
                      rules={[
                        { required: true, message: "Vui lòng nhập phần trăm" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        className="w-full"
                        formatter={(value) => `${value}%`}
                        addonAfter={<PercentageOutlined />}
                      />
                    </Form.Item>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="link"
                    danger
                    className="absolute right-2 top-2"
                    onClick={() => remove(name)}
                  >
                    Xoá
                  </Button>
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm danh mục
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

const SpendingModelDetail = () => {
  const { TITLE } = TEXT_TRANSLATE;
  const { state, handler } = useSpendingModelManagementPage();

  const getPercentageText = (percentage: number) => {
    if (percentage === 100) {
      return (
        <>
          Đã phân bổ đủ <span className="text-green">100%</span> ngân sách
        </>
      );
    }
    if (percentage > 100) {
      return (
        <>
          Đã phân bổ vượt quá <span className="text-red">100%</span>, vui lòng
          điều chỉnh
        </>
      );
    }
    return (
      <>
        Còn <span className="text-red">{(100 - percentage).toFixed(1)}%</span>{" "}
        chưa được phân bổ
      </>
    );
  };

  return (
    <TableListLayout
      subTitle={""}
      title={state.TITLE.MANAGE_MODEL_DETAIL}
      breadcrumbItems={state.breadcrumbItems}
      isLoading={state.isLoading}
    >
      <div className="min-h-screen p-6">
        <motion.div
          className="flex gap-5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="mb-8 w-full flex-[0.5] rounded-lg border shadow-md transition-shadow duration-500 hover:shadow-lg">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <Tag
                    color={
                      state.spendingModel?.data?.isTemplate ? "green" : "blue"
                    }
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {state.spendingModel?.data?.isTemplate
                      ? "Mẫu mặc định"
                      : "Tùy chỉnh"}
                  </Tag>
                </div>
                {!state.isEditing && (
                  <ButtonCustom
                    onClick={() => handler.setIsEditing(true)}
                    className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 hover:shadow"
                  >
                    <EditOutlined /> Chỉnh sửa
                  </ButtonCustom>
                )}
              </div>
              <div>
                {state.isEditing ? (
                  <Form
                    form={state.form}
                    layout="vertical"
                    className="space-y-6"
                  >
                    <Form.Item
                      name="name"
                      label={<span className="text-sm">Tên mô hình</span>}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên mô hình",
                        },
                      ]}
                    >
                      <Input
                        className="rounded-md border-gray-300 text-lg font-bold focus:border-primary"
                        placeholder="Nhập tên mô hình"
                        prefix={<FileTextOutlined className="text-gray-400" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label={<span className="text-sm">Mô tả chi tiết</span>}
                      rules={[
                        { required: true, message: "Vui lòng nhập mô tả" },
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                    >
                      <ReactQuill
                        theme="snow"
                        className="rounded-md border-gray-300 focus:border-primary"
                        onChange={(content) => {
                          state.form.setFieldsValue({ description: content });
                          if (!content.trim()) {
                            state.form.setFields([
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
                        onClick={() => handler.setIsEditing(false)}
                        className="rounded-md !border !border-red !bg-white px-4 py-2 text-red transition-all"
                      >
                        Hủy
                      </ButtonCustom>
                      <ButtonCustom
                        onClick={handler.handleUpdateModel}
                        className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
                      >
                        <SaveOutlined /> Lưu thay đổi
                      </ButtonCustom>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <Title
                      level={2}
                      className="mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-3xl font-bold text-transparent"
                    >
                      {state.spendingModel?.data?.name}
                    </Title>
                    <Divider className="my-6" />
                    <div className="mt-6 text-gray-600">
                      {parse(state.spendingModel?.data?.description ?? "")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8 w-full flex-[0.5] rounded-lg border shadow-md transition-shadow duration-500 hover:shadow-lg">
            {state.budgets && state.budgets.length > 0 ? (
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <Title level={4} className="m-0">
                    Phân bổ ngân sách
                  </Title>
                  {!state.spendingModel?.data?.isTemplate && (
                    <div className="flex items-center gap-2">
                      {state.isEditingAll ? (
                        <>
                          <ButtonCustom
                            onClick={handler.handleUpdatePercentage}
                            className="flex items-center gap-1 bg-primary text-white"
                          >
                            <SaveOutlined /> Lưu thay đổi
                          </ButtonCustom>
                          <ButtonCustom
                            onClick={() => {
                              handler.setIsEditingAll(false);
                              handler.setEditingPercentages({});
                              const originalTotal =
                                state.spendingModel?.data?.spendingModelCategories.reduce(
                                  (sum, item) => sum + item.percentageAmount,
                                  0,
                                );
                              handler.setTotalPercentage(originalTotal || 0);
                            }}
                            className="rounded-md !border !border-red !bg-white px-4 py-2 text-red transition-all"
                          >
                            Hủy
                          </ButtonCustom>
                        </>
                      ) : (
                        <ButtonCustom
                          onClick={() => {
                            handler.setIsEditingAll(true);
                            const initialPercentages: Record<string, number> =
                              {};
                            state.spendingModel?.data?.spendingModelCategories.forEach(
                              (cat) => {
                                initialPercentages[cat.categoryId] =
                                  cat.percentageAmount;
                              },
                            );
                            handler.setEditingPercentages(initialPercentages);
                          }}
                          className="flex items-center gap-1 text-white"
                        >
                          <EditOutlined /> Chỉnh sửa tất cả
                        </ButtonCustom>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-lg bg-[#eee]">
                  {state.budgets &&
                    state.budgets.length > 0 &&
                    state.budgets?.map((budget, index) => (
                      <Tooltip
                        key={index}
                        title={
                          <div className="flex items-center gap-2">
                            {renderIcon(budget?.icon)}
                            <span>
                              {budget.name}: <strong>{budget?.percent}%</strong>
                            </span>
                          </div>
                        }
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${budget.percent}%` }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                          style={{ backgroundColor: budget.color }}
                          className="h-full"
                        />
                      </Tooltip>
                    ))}
                </div>
                <Text
                  type="secondary"
                  className={`mb-4 block text-sm ${handler.getPercentageClass(state.totalPercentage)}`}
                >
                  {getPercentageText(state.totalPercentage)}
                </Text>
                <div className="mt-4 space-y-2">
                  {state.spendingModel?.data?.spendingModelCategories.map(
                    (category) => (
                      <div
                        key={category.categoryId}
                        className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center text-xl">
                            {renderIcon(category.category.icon)}
                          </span>
                          <span>{category.category.name}</span>
                          <Tag
                            color={
                              category.category.type ===
                              CATEGORY_TYPE_TEXT.INCOME
                                ? "green"
                                : "red"
                            }
                          >
                            {category.category.type ===
                            CATEGORY_TYPE_TEXT.INCOME
                              ? "Thu nhập"
                              : "Chi tiêu"}
                          </Tag>
                        </div>
                        {state.isEditingAll ? (
                          <InputNumber
                            min={0}
                            max={100}
                            value={
                              state.editingPercentages[category.categoryId] ?? 0
                            }
                            onChange={(value) => {
                              handler.setEditingPercentages({
                                ...state.editingPercentages,
                                [category.categoryId]: value ?? 0,
                              });
                            }}
                            formatter={(value) => `${value ?? 0}%`}
                            className="w-24"
                            disabled={
                              category.category.type ===
                              CATEGORY_TYPE_TEXT.INCOME
                            }
                          />
                        ) : (
                          <Tag
                            color="blue"
                            className="min-w-[60px] text-center"
                          >
                            {category.percentageAmount}%
                          </Tag>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description={
                  <Text className="text-gray-500">
                    Chưa có danh mục nào được thêm vào mô hình này
                  </Text>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="mt-20"
              />
            )}
          </div>
        </motion.div>

        <div className="mx-auto mb-5 mt-16">
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
                <Radio.Button
                  value={CATEGORY_TYPE_TEXT.INCOME}
                  className="font-medium"
                >
                  Thu nhập
                </Radio.Button>
                <Radio.Button
                  value={CATEGORY_TYPE_TEXT.EXPENSE}
                  className="font-medium"
                >
                  Chi tiêu
                </Radio.Button>
              </Radio.Group>
            </div>

            {!state.spendingModel?.data?.isTemplate && (
              <Tooltip title="Thêm danh mục vào mô hình">
                <ButtonCustom
                  className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90 hover:shadow-md"
                  onClick={handler.handleOpenModalAdd}
                  disabled={state.availableCategories?.length === 0}
                >
                  <PlusOutlined /> Thêm danh mục
                </ButtonCustom>
              </Tooltip>
            )}
          </div>
          <Row gutter={[16, 16]}>
            {state.filteredCategories?.length ? (
              state.filteredCategories.map((category) => (
                <Col key={category.categoryId} xs={24} sm={12} lg={8} xl={6}>
                  <CategoryCard
                    spendingModelId={state.id as string}
                    category={category.category}
                    percentageAmount={category.percentageAmount}
                    onRemove={() =>
                      handler.handleRemoveSpendingModelCategory(
                        state.id as string,
                        category.categoryId,
                        handler.refetch,
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
                    disabled={state.availableCategories?.length === 0}
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
        onOk={() =>
          handler.handleAddModelCategory(state.id as string, handler.refetch)
        }
        onCancel={handler.handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          className: "!bg-primary text-white !hover:bg-primary/90",
        }}
        cancelButtonProps={{
          className: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        }}
        maskClosable={false}
        destroyOnClose
      >
        <CategoryFormList
          form={state.form}
          availableCategories={state.availableCategories}
          hasExistingCategories={
            state.filteredCategories && state.filteredCategories?.length > 0
          }
        />
      </Modal>
    </TableListLayout>
  );
};

export { SpendingModelDetail };
