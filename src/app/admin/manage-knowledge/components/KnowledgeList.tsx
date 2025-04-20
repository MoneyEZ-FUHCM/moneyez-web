"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { useKnowledge } from "../hooks/useKnowledge";

const KnowledgeList = () => {
  const { state, handler } = useKnowledge();

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
          onAddClick={() => {
            console.log("hi");
          }}
        />
        <TableCustom
          title={"Danh sách tài liệu"}
          // columns={columns as any}
          dataSource={[]}
          pagination={{
            current: 1,
            total: 100,
            pageSize: 10,
          }}
          onChange={handler.handlePageChange}
          loading={state.isLoadingKnowledgeList}
          rowKey={(record: { id: number }) => record.id}
        />
      </TableListLayout>
    </div>
  );
};

export { KnowledgeList };
