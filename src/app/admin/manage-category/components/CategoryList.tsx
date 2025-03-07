"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/utils";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCategoryManagementPage } from "../hooks/useCategoryManagementPage";
import { AddCategoryModal } from "./AddCategoryModal";

const CategoryList = () => {
  const router = useRouter();
  const { state, handler } = useCategoryManagementPage();

  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        render: (_: any, _record: any, index: number) => index + 1,
        width: "2%",
      },
      {
        title: state.TITLE.CODE,
        dataIndex: state.FORM_NAME.CODE,
        width: "15%",
      },
      {
        title: state.TITLE.ICON,
        dataIndex: state.FORM_NAME.ICON,
        width: "15%",
      },
      {
        title: state.TITLE.NAME,
        dataIndex: state.FORM_NAME.NAME,
        width: "23%",
      },
      {
        title: state.TITLE.DESCRIPTION,
        dataIndex: state.FORM_NAME.DESCRIPTION,
        width: "30%",
      },
      {
        title: state.TITLE.CREATED_AT,
        dataIndex: state.FORM_NAME.CREATED_DATE,
        width: "10%",
        render: (date: string) =>
          date ? formatTimestamp(date) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        width: "5%",
        render: (record: any) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
              onClick={() => handler.handleViewDetail(record)}
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button>
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EditOutlined color="blue" className="text-primary" />
            </Button>
            <Button
              onClick={() => handler.handleDeleteCategory(record.id)}
              danger
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <DeleteOutlined />
            </Button>
          </div>
        ),
      },
    ],
    [handler, router],
  );

  return (
    <TableListLayout title={state.TITLE.MANAGE_CATEGORY} breadcrumbItems={[]}>
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_CATEGORY}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.CATEGORY_LIST}
        columns={columns}
        dataSource={state.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state?.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingCategoryList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddCategoryModal />
    </TableListLayout>
  );
};

export { CategoryList };
