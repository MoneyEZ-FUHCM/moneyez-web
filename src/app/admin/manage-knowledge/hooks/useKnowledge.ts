import { useGetKnowledgeListQuery } from "@/services/admin/knowledge";
import { TablePaginationConfig } from "antd";
import { useState } from "react";

const useKnowledge = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: knowLedgeList, isLoading: isLoadingKnowledgeList } =
    useGetKnowledgeListQuery({
      PageIndex: pageIndex,
      PageSize: pageSize,
    });

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };
  console.log("check knowLedgeList?.items", knowLedgeList?.items);
  return {
    state: {
      knowLedgeList: knowLedgeList?.items ?? [],
      isLoadingKnowledgeList,
    },
    handler: {
      handlePageChange,
    },
  };
};

export { useKnowledge };
