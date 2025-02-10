"use client";
import { TableProps } from "antd";
import { ReactNode } from "react";
import { BreadScrumb } from "../common/BreadScrumb";

interface CommonTableLayoutProps extends TableProps<any> {
  title: any;
  breadcrumbItems: { href?: string; title: ReactNode }[];
  children?: ReactNode;
}

const TableListLayout = ({
  title,
  breadcrumbItems = [],
  children,
  ...tableProps
}: CommonTableLayoutProps) => {
  return (
    <main>
      {breadcrumbItems.length > 0 && <BreadScrumb items={breadcrumbItems} />}
      <div className="mt-3 rounded-t-xl bg-[#fff] p-5">
        <p className="text-3xl font-bold">{title}</p>
      </div>
      <div className="bg-[#fff] p-5">{children}</div>
    </main>
  );
};

export { TableListLayout };
