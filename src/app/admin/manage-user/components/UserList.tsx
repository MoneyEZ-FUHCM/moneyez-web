"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/utils";
import { Button, Popconfirm, Tag } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { FaBan } from "react-icons/fa";
import Avatar from "@/assets/images/logo/avatar_user.jpg";
import { useUserManagementPage } from "../hooks/useUserManagementPage";
import { AddUserModal } from "./AddUserModal";

const UserList = () => {
  const { state, handler } = useUserManagementPage();

  // nếu có xài thì tương tự (thay [] = items)
  // const items = [
  //   {
  //     href: "/store/product",
  //     title: "Trang chủ",
  //   },
  //   {
  //     title: "Đơn hàng",
  //   },
  // ];

  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        render: (_: any, _record: any, index: number) => index + 1,
      },
      {
        title: state.TITLE.EMAIL,
        dataIndex: state.FORM_NAME.EMAIL,
        width: "20%",
      },
      {
        title: state.TITLE.AVATAR,
        dataIndex: state.FORM_NAME.AVATAR,
        width: "10%",
        render: (avatar: string) => (
          <Image
            src={avatar || Avatar}
            alt="error"
            width={50}
            height={50}
            className="rounded-[100%]"
          />
        ),
      },
      {
        title: state.TITLE.FULLNAME,
        dataIndex: state.FORM_NAME.FULLNAME,
        width: "14%",
      },
      {
        title: state.TITLE.DOB,
        dataIndex: state.FORM_NAME.DOB,
        width: "7%",
        render: (dob: string) =>
          dob ? formatTimestamp(dob) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.ADDRESS,
        dataIndex: state.FORM_NAME.ADDERSS,
        width: "13%",
        render: (address: string) => address || COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.PHONE_NUMBER,
        dataIndex: state.FORM_NAME.PHONE_NUMBER,
        width: "10%",
      },
      {
        title: state.TITLE.ROLE,
        dataIndex: state.FORM_NAME.ROLE,
        width: "7%",
        render: (role: string) => {
          let roleText = COMMON_CONSTANT.EMPTY_STRING;
          let tagColor = COMMON_CONSTANT.EMPTY_STRING;
          switch (role) {
            case VALID_ROLE.USER:
              roleText = state.TITLE.USER;
              tagColor = "blue";
              break;
            case VALID_ROLE.ADMIN:
              roleText = state.TITLE.ADMIN;
              tagColor = "pink";
              break;
            default:
              break;
          }
          return <Tag color={tagColor}>{roleText}</Tag>;
        },
      },
      {
        title: state.TITLE.STATUS,
        dataIndex: state.FORM_NAME.IS_DELETED,
        render: (status: boolean) => {
          let statusText = status ? state.TITLE.ACTIVE : state.TITLE.INACTIVE;
          let tagColor = status ? "green" : "red";
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
        width: "10%",
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        render: () => (
          <Popconfirm
            title={state.TITLE.BAN_USER}
            okText={state.TITLE.YES}
            cancelText={state.TITLE.NO}
          >
            <Button danger size="small" className="border-none">
              <FaBan />
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [],
  );

  return (
    <TableListLayout title={state.TITLE.MANAGE_USER} breadcrumbItems={[]}>
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_USER}
        onSearch={(value) => console.log("Tìm kiếm...", value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.USER_LIST}
        columns={columns}
        dataSource={state?.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingUserList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddUserModal />
    </TableListLayout>
  );
};

export { UserList };
