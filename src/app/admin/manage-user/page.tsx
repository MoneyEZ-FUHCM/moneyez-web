import { Metadata } from "next";
import { UserList } from "./components";

export const metadata: Metadata = {
  title: "EzMoney | Quản lý người dùng",
  description: "Theo dõi, quản lý người dùng trong hệ thống",
};

const UserManagement = () => {
  return (
    <main>
      <div className="rounded-t-xl bg-[#fff] p-5">
        <p className="text-3xl font-bold">Quản lý người dùng</p>
      </div>
      <div className="bg-[#fff] p-5">
        <UserList />
      </div>
    </main>
  );
};

export default UserManagement;
