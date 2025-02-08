"use client";

import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const { logout } = useLogout();
  const router = useRouter();
  return (
    <section>
      <button onClick={logout}>Đăng xuất</button>
      <button onClick={() => router.push("/admin/statistic")}>Thống kê</button>
    </section>
  );
};

export default AdminPage;
