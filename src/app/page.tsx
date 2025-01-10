"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const showSuccessToast = () => {
    toast.success("Thành công!", {
      duration: 2000,
      description: "Lụm",
      // icon: <AlertTriangle className="text-yellow-500" />,
    });
  };

  const showErrorToast = () => {
    toast.error("Thất bại!", {
      description: "Cút",
    });
  };

  const Logout = () => {
    Cookies.remove("accessToken");
    router.replace("/auth");
  };

  return (
    <div>
      <button
        onClick={showSuccessToast}
        className="bg-green-500 hover:bg-green-600 m-2 rounded px-4 py-2 text-black"
      >
        success
      </button>
      <button
        onClick={showErrorToast}
        className="bg-red-500 hover:bg-red-600 m-2 rounded px-4 py-2 text-black"
      >
        fail
      </button>
      <button
        onClick={Logout}
        className="bg-red-500 hover:bg-red-600 m-2 rounded px-4 py-2 text-black"
      >
        Đăng xuất
      </button>
    </div>
  );
}
