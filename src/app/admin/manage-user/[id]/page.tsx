import { Metadata } from "next";
import { UserDetail } from "../components";

export const metadata: Metadata = {
  title: "MoneyEz | Thông tin người dùng",
  description: "Chi tiết thông tin người dùng trong hệ thống",
};

const UserDetailPage = () => {
  return <UserDetail />;
};

export default UserDetailPage;
