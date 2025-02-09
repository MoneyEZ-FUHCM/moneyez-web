"use client";

import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Form, Popconfirm, Table, Tag } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { InputCustom } from "@/components/ui/input";
import { FaBan } from "react-icons/fa";

const UserList: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = React.useState(10);

  // const { data, isFetching, totalCount, refetch } = useFetchUsers(
  //   currentPage,
  //   pageSize,
  // );

  // const handleRefetch = useCallback(() => {
  //   refetch();
  // }, []);

  // const handleDeleteUser = useCallback(async (userId: number) => {
  //   try {
  //     const res = await deleteUser(userId);
  //     if (res && res.status === 200) {
  //       handleRefetch();
  //       notify("success", `${res.data.message}`, 3);
  //     }
  //   } catch (err: any) {
  //     console.error("err", err);
  //     showToast("error", `${err.response.data.message}`, 3);
  //   }
  // }, []);

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  }, []);

  const columns: TableProps["columns"] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        render: (_, _record, index) => index + 1,
      },
      {
        title: "Email",
        dataIndex: "email",
        width: "20%",
      },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        width: "15%",
      },
      {
        title: "Ngày sinh",
        dataIndex: "dob",
        width: "15%",
        render: (dob) => {
          if (dob) {
            // return formatTimestamp(dob);
          } else {
            return "N/A";
          }
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        width: "17%",
        render: (address) => {
          if (address) return address;
          return "N/A";
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        width: "10%",
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        width: "7%",
        render: (role) => {
          return "";
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => {
          let statusText = "";
          let tagColor = "";
          switch (status) {
            case "ACTIVE":
              statusText = "ACTIVE";
              tagColor = "green";
              break;
            case "BANNED":
              statusText = "INACTIVE";
              tagColor = "pink";
              break;
            default:
              statusText = "UNKNOWN";
              tagColor = "gray";
              break;
          }
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
        width: "10%",
      },
      {
        title: "",
        dataIndex: "",
      },
      {
        title: "Chức năng",
        dataIndex: "",
        render: (_, record) => (
          <Popconfirm
            title="Bạn có muốn cấm người dùng này không?"
            // onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
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
    <section>
      <div className="flex justify-between">
        <Form className="flex gap-x-1">
          <Form.Item name="search">
            <InputCustom
              placeholder="Tìm kiếm..."
              className="h-10 max-w-lg rounded-md sm:w-[300px]"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="flex h-10 w-10 items-center !bg-primary"
            >
              <SearchOutlined className="align-middle text-white" />
            </Button>
          </Form.Item>
        </Form>

        <div className="flex gap-x-2">
          <Button className="h-10 !bg-primary" onClick={() => setIsOpen(true)}>
            <div className="flex justify-center">
              <UserAddOutlined className="mr-1 text-lg text-white" />{" "}
              <span className="font-medium text-white">Thêm người dùng</span>
            </div>
          </Button>
        </div>
      </div>
      <Table
        className="pagination"
        id="myTable"
        columns={columns}
        // dataSource={data?.data}
        pagination={{
          current: currentPage,
          // total: totalCount || 0,
          pageSize: pageSize,
        }}
        onChange={handleTableChange}
        // loading={isFetching}
        // rowKey={(record) => record.id}
      />
      {/* <AddUserModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleRefetch={handleRefetch}
      /> */}
    </section>
  );
});

export { UserList };
