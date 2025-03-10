"use client";

import Avatar from "@/assets/images/logo/avatar_user.jpg";
import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useGroupManagementPage } from "../hooks/useGroupManagementPage";
import { AddGroupModal } from "./AddGroupModal";
import { formatCurrency } from "@/utils";

const GroupList = () => {
  const { state, handler } = useGroupManagementPage();
  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        width: "5%",
        render: (_: any, _record: any, index: number) => 
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: state.TITLE.NAME,
        dataIndex: state.FORM_NAME.NAME,
        width: "15%",
      },
      {
        title: state.TITLE.AVATAR,
        dataIndex: state.FORM_NAME.IMAGE_URL,
        width: "10%",
        render: (imageUrl: string) => (
          <Image
            src={imageUrl || Avatar}
            alt="error"
            width={50}
            height={50}
            className="rounded-[100%]"
          />
        ),
      },
      {
        title: state.TITLE.DESCRIPTION,
        dataIndex: state.FORM_NAME.DESCRIPTION,
        width: "20%",
      },
      {
        title: state.TITLE.BALANCE,
        dataIndex: state.FORM_NAME.CURRENT_BALANCE,
        width: "10%",
        render: (currentBalance: number) => (
          formatCurrency(currentBalance)
        ),
      },
      {
        title: state.TITLE.VISIBILITY,
        dataIndex: state.FORM_NAME.VISIBILITY,
        width: "10%",
        render: (visibility: string) => {
          let visibilityText = visibility === "PUBLIC" ? state.TITLE.PUBLIC : state.TITLE.PRIVATE;
          let tagColor = visibility === "PUBLIC" ? "blue" : "orange";
          return <Tag color={tagColor}>{visibilityText}</Tag>;
        },
      },
      {
        title: state.TITLE.STATUS,
        dataIndex: state.FORM_NAME.STATUS,
        width: "10%",
        render: (status: string) => {
          let statusText = status === "ACTIVE" ? state.TITLE.ACTIVE : state.TITLE.INACTIVE;
          let tagColor = status === "ACTIVE" ? "green" : "red";
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
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
              onClick={() => handler.handleDeleteGroup(record.id)}
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
    <TableListLayout title={state.TITLE.MANAGE_GROUP} breadcrumbItems={[]}>
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_GROUP}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.GROUP_LIST}
        columns={columns}
        dataSource={state?.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state?.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingGroupList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddGroupModal />
    </TableListLayout>
  );
};

export { GroupList };
