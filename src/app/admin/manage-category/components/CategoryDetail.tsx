"use client";

import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/utils";
import { Descriptions, Spin, Table } from "antd";
import { useParams } from "next/navigation";
import { useGetCategoryByIdQuery } from "@/services/admin/category";
import { TEXT_TRANSLATE } from "../category.translate";
import { TableListLayout } from "@/components";
import { useMemo } from "react";

const CategoryDetail = () => {
  const { id } = useParams();
  const { TITLE } = TEXT_TRANSLATE;
  const { data: category, isLoading } = useGetCategoryByIdQuery(id as string);

  const breadcrumbItems = [
    {
      href: "/admin/manage-category",
      title: TITLE.MANAGE_CATEGORY,
    },
    {
      title: TITLE.CATEGORY_DETAIL,
    },
  ];

  const subCategoryColumns = useMemo(
    () => [
      {
        title: TITLE.INDEX,
        key: 'index',
        width: '5%',
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: TITLE.NAME,
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: TITLE.DESCRIPTION,
        dataIndex: 'description',
        width: '45%',
      },
      {
        title: TITLE.CREATED_AT,
        dataIndex: 'createdDate',
        width: '30%',
        render: (date: string) => formatTimestamp(date),
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spin />
      </div>
    );
  }

  return (
    <TableListLayout title={TITLE.CATEGORY_DETAIL} breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {/* Main Category Information */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">{TITLE.MAIN_CATEGORY_INFO}</h2>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={TITLE.NAME}>
              {category?.data?.name || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.DESCRIPTION}>
              {category?.data?.description || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.CREATED_AT}>
              {category?.data?.createdDate ? formatTimestamp(category?.data?.createdDate) : COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.CREATED_BY}>
              {category?.data?.createdBy || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.UPDATED_AT}>
              {category?.data?.updatedDate ? formatTimestamp(category?.data?.updatedDate) : COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.UPDATED_BY}>
              {category?.data?.updatedBy || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Subcategories Table */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">{TITLE.SUBCATEGORIES}</h2>
          <Table
            columns={subCategoryColumns}
            dataSource={category?.data?.subcategories || []}
            pagination={false}
            rowKey="id"
          />
        </div>
      </div>
    </TableListLayout>
  );
};

export { CategoryDetail };
