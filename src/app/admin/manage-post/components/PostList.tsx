"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/helpers/libs/utils";
import { Post } from "@/types/post.types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import parse from "html-react-parser";
import Image from "next/image";
import { useMemo } from "react";
import { usePostManagementPage } from "../hooks/usePostManagement";
import { FunctionPostModal } from "./FunctionPostModal";

const PostList = () => {
  const { state, handler } = usePostManagementPage();

  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        width: "2%",
        render: (_: any, _record: any, index: number) =>
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: state.TITLE.CODE,
        dataIndex: state.FORM_NAME.TITLE,
        width: "10%",
      },
      {
        title: state.TITLE.SHORT_CONTENT,
        dataIndex: state.FORM_NAME.SHORT_CONTENT,
        width: "15%",
      },
      {
        title: state.TITLE.CONTENT,
        dataIndex: state.FORM_NAME.CONTENT,
        width: "20%",
        render: (content: string) => (
          <Tooltip title={parse(content)} styles={{ body: { width: 1000 } }}>
            <div className="line-clamp-5">{parse(content)}</div>
          </Tooltip>
        ),
      },
      {
        title: state.TITLE.THUMBNAIL,
        dataIndex: state.FORM_NAME.THUMBNAIL,
        width: "15%",
        render: (thumbnail: string, record: any) => (
          <Image
            src={thumbnail ?? ""}
            alt="lỗi"
            width={50}
            height={50}
            className="h-28 w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ),
      },
      {
        title: state.TITLE.CREATED_AT,
        dataIndex: state.FORM_NAME.CREATED_DATE,
        width: "5%",
        render: (date: string) =>
          date ? formatTimestamp(date) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        width: "6%",
        render: (_: any, record: Post) => (
          <div className="flex items-center justify-center gap-2">
            {/* <Button
              onClick={() => handler.handleViewDetail(record)}
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button> */}
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
              onClick={() => handler.handleOpenModalEdit(record)}
            >
              <EditOutlined className="text-primary" />
            </Button>
            <Button
              onClick={() => handler.handleDeletePost(record.id)}
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
    [handler, state.pageIndex, state.pageSize],
  );

  return (
    <TableListLayout
      subTitle={state.TITLE.SUB_TITLE}
      title={state.TITLE.MANAGE_POST}
      breadcrumbItems={[]}
    >
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH_SUB}
        addButtonText={state.BUTTON.ADD_POST}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.POST_LIST}
        columns={columns as any}
        dataSource={state.data?.items ?? []}
        pagination={{
          current: state.pageIndex,
          total: state.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingPostList}
        rowKey={(record: { id: number }) => record.id}
      />
      <FunctionPostModal />
    </TableListLayout>
  );
};

export { PostList };
