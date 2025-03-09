"use client";

import { TableListLayout } from "@/components";
import { useGetSpendingModelIdQuery } from "@/services/admin/spendingModel";
import { Col, Radio, Row, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";
import { TEXT_TRANSLATE } from "../model.translate";
import { CategoryCard } from "./CategoryCard";

const { Title, Text } = Typography;

const SpendingModelDetail = () => {
  const { id } = useParams();
  const { TITLE } = TEXT_TRANSLATE;
  const { data: spendingModel, isLoading } = useGetSpendingModelIdQuery(
    id as string,
  );

  const [selectedType, setSelectedType] = useState<string>("ALL");

  const filteredCategories = spendingModel?.data?.spendingModelCategories.filter(
    (category) => selectedType === "ALL" || category.category.type === selectedType
  );

  const breadcrumbItems = [
    {
      href: "/admin/manage-model",
      title: TITLE.MANAGE_MODEL,
    },
    {
      title: TITLE.MANAGE_MODEL_DETAIL,
    },
  ];

  return (
    <TableListLayout
      title={TITLE.MANAGE_MODEL_DETAIL}
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

        <div className="mb-4">
          <Radio.Group 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">Tất cả</Radio.Button>
            <Radio.Button value="INCOME">Thu nhập</Radio.Button>
            <Radio.Button value="EXPENSE">Chi tiêu</Radio.Button>
          </Radio.Group>
        </div>

        <Row gutter={[16, 16]}>
          {filteredCategories?.map((category) => (
            <Col key={category.categoryId} xs={24} sm={12} lg={8}>
              <CategoryCard
                category={category.category}
                percentageAmount={category.percentageAmount}
              />
            </Col>
          ))}
        </Row>
      </div>
    </TableListLayout>
  );
};

export { SpendingModelDetail };

