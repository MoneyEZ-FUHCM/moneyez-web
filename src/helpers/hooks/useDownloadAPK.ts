"use client";

import { useCallback } from "react";

const useDownloadApk = () => {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href =
      "https://drive.google.com/drive/folders/17IxEvarY0fXSZOz3JWJUKUUX-_XxTmfu?usp=sharing";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { handleDownload };
};

export default useDownloadApk;
