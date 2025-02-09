import { Table } from "antd";
import type { TableProps } from "antd";

interface CommonTableProps extends TableProps<any> {
  title: any;
}

const TableCustom = ({ title, ...props }: CommonTableProps) => {
  return (
    <section>
      {title && <p className="mb-2 text-sm font-medium">{title}</p>}
      <Table {...props} />
    </section>
  );
};

export { TableCustom };
