import { UserList } from "./components";

const ManageUser = () => {
  return (
    <>
      <div className="rounded-t-xl bg-[#fff] p-5">
        <p className="text-3xl font-bold">Quản lý người dùng</p>
      </div>
      <div className="bg-[#fff] p-5">
        <UserList />
      </div>
    </>
  );
};

export default ManageUser;
