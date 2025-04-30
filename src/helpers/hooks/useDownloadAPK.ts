"use client";

import { useCallback } from "react";

const useDownloadApk = () => {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/moneyez-web/apk/moneyez.apk";
    link.download = "moneyez.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { handleDownload };
};

export default useDownloadApk;
