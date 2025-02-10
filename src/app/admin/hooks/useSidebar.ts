import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem } from "../admin.constant";

const useSidebar = (items: MenuItem[]) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const pathname = usePathname();

  const storeDefaultSelectedKeys = (key: string) => {
    sessionStorage.setItem("keys", key);
  };

  useEffect(() => {
    setCollapsed(true);
  }, []);

  useEffect(() => {
    const currentPath = pathname;
    const matchedItem = items.find((item) => item.path === currentPath);
    if (matchedItem) {
      setSelectedKeys([matchedItem.key]);
      storeDefaultSelectedKeys(matchedItem.key);
    }
  }, [pathname, items]);

  return {
    collapsed,
    setCollapsed,
    selectedKeys,
    storeDefaultSelectedKeys,
  };
};

export { useSidebar };
