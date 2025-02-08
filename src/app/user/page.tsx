"use client";

import { useLogout } from "@/hooks/useLogout";

const allowedRoles = ["USER"];
const rolePaths = {
  admin: "/user",
};

const UserPages = () => {
  const { logout } = useLogout();

  return (
    <section>
      <button onClick={logout}>Đăng xuất USER</button>
    </section>
  );
};

export default UserPages;
