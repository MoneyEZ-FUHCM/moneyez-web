"use client";

import { useLogout } from "@/hooks/useLogout";

const AdminPage = () => {
  const { logout } = useLogout();
  return (
    <section>
      <button onClick={logout}>Đăng xuất</button>
    </section>
  );
};

export default AdminPage;
