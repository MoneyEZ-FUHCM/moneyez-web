"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/helpers/libs/utils";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMemo } from "react";
import { useKnowledgeManagement } from "../hooks/useKnowledgeManagement";
import { FunctionKnowledgeModal } from "./FunctionKnowledgeModal";

const KnowledgeList = () => {
  const { state, handler } = useKnowledgeManagement();

  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        width: "5%",
        render: (_: any, _record: any, index: number) =>
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: "Tên tài liệu",
        dataIndex: "name",
        key: "name",
        width: "45%",
      },
      {
        title: "Kích thước",
        dataIndex: "size",
        key: "size",
        width: "15%",
        render: (size: string) =>
          size ? <span>{size} KB</span> : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdDate",
        key: "createdDate",
        width: "14%",
        render: (date: string) =>
          date ? formatTimestamp(date) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedDate",
        key: "updatedDate",
        width: "14%",
        render: (date: string) =>
          date ? formatTimestamp(date) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: "Chức năng",
        dataIndex: "",
        width: "7%",
        render: (record: any) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => handler.handleDeleteFile(record.id)}
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
    [],
  );

  return (
    <div>
      <TableListLayout
        subTitle={"Tài liệu hỗ trợ chatbot"}
        title={"Quản lý tài liệu"}
        breadcrumbItems={[]}
      >
        <SearchAndAdd
          searchPlaceholder={"Tìm kiếm tài liệu..."}
          addButtonText={"Thêm tài liệu"}
          onSearch={(value) => {}}
          onAddClick={handler.handleOpenModalAdd}
        />
        <TableCustom
          title={"Danh sách tài liệu"}
          columns={columns}
          dataSource={state.knowLedgeList?.items ?? []}
          pagination={{
            current: state.pageIndex,
            total: state.knowLedgeList?.totalCount,
            pageSize: state.pageSize,
          }}
          onChange={handler.handlePageChange}
          loading={state.isLoadingKnowledgeList}
          rowKey={(record: { id: number }) => record.id}
        />

        <FunctionKnowledgeModal />
      </TableListLayout>
    </div>
  );
};

export { KnowledgeList };
