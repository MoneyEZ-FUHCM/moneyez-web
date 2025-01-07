"use client";

import { toast } from "sonner";

export default function Home() {
  const showSuccessToast = () => {
    toast.success("Thành công!", {
      duration: 2000,
      description: "Lụm",
    });
  };

  const showErrorToast = () => {
    toast.error("Thất bại!", {
      description: "Cút",
    });
  };

  return (
    <div>
      <button
        onClick={showSuccessToast}
        className="m-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        success
      </button>
      <button
        onClick={showErrorToast}
        className="m-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        fail
      </button>
    </div>
  );
}
