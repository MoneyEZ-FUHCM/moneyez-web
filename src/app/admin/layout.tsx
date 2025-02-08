"use client";

import Admin from "@/assets/images/logo/avatar_admin.jpg";
import LogoWeb from "@/assets/images/logo/logo_web.png";
import { useLogout } from "@/hooks/useLogout";
import { PieChartOutlined, PushpinOutlined } from "@ant-design/icons";
import { FloatButton, Layout, LayoutProps, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { MenuItem } from "./admin.constant";
import { useSidebar } from "./hooks/useSidebar";

const { Content, Sider, Footer } = Layout;

function getItem(
  label: React.ReactNode,
  key: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  path?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Thống kê", "1", <PieChartOutlined />, undefined, "/admin/statistic"),
  getItem(
    "Người dùng",
    "2",
    <PushpinOutlined />,
    undefined,
    "/admin/manage-user",
  ),
];

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { collapsed, setCollapsed, selectedKeys, storeDefaultSelectedKeys } =
    useSidebar(items);
  const { logout } = useLogout();

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      if (
        item &&
        "children" in item &&
        item.children &&
        item.children.length > 0
      ) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => storeDefaultSelectedKeys(item.key)}
          >
            {item.path ? (
              <Link href={item.path}>{item.label}</Link>
            ) : (
              item.label
            )}
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="60"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={`scrollbar sider bottom-0 left-0 top-0 z-[1000] box-border min-h-screen flex-none overflow-auto overflow-y-auto ${collapsed ? "collapsed" : ""}`}
        theme="light"
        collapsible
      >
        <div className="demo-logo-vertical" />
        <div className="my-7 flex justify-center">
          <Image
            className="w-7/12 select-none object-cover"
            src={LogoWeb}
            alt=""
            quality={80}
          />
        </div>
        <Menu
          theme="light"
          selectedKeys={selectedKeys}
          mode="inline"
          className="select-none"
        >
          {renderMenuItems(items)}
        </Menu>
      </Sider>
      <Layout
        className="scrollbar right-bar ease overflow-y-auto transition-all duration-150 ease-in-out"
        style={{ marginLeft: collapsed ? 55 : 230 }}
      >
        <div className="header fixed z-[999] flex h-16 items-center justify-end gap-2 bg-[#f8f8f8] bg-opacity-80 pr-5 shadow-none backdrop-blur-[6px]">
          {
            <>
              <Image
                className="h-[42px] w-[42px] rounded-full border object-cover ring-2 ring-gray-300 hover:ring-[#0077ff]"
                src={Admin}
                alt="error"
                width={42}
                height={42}
              />
              <div className="flex flex-col">
                <strong>ADMIN</strong>
                <button
                  className="cursor-pointer font-semibold text-[#5099ff] hover:underline"
                  onClick={logout}
                >
                  Đăng xuất
                </button>
              </div>
            </>
          }
        </div>
        <Content className="mx-4 mt-[80px]">
          <div className="min-w-[250px] overflow-x-auto rounded-xl">
            {children}
          </div>
        </Content>
        <Footer className="text-center">
          Copyright &copy;2025 EzMoney.inc. All right reserved
        </Footer>
        <FloatButton.BackTop />
      </Layout>
    </Layout>
  );
};

export default memo(DashboardLayout);
