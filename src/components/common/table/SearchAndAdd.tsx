import { InputCustom } from "@/components/ui/input";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";

interface SearchAndAddProps {
  searchPlaceholder?: string;
  addButtonText: string;
  onSearch?: (value: string) => void;
  onAddClick: () => void;
}

const SearchAndAdd = ({
  searchPlaceholder = "Tìm kiếm...",
  addButtonText,
  onSearch,
  onAddClick,
}: SearchAndAddProps) => {
  return (
    <div className="flex justify-between">
      <Form
        className="flex gap-x-1"
        onFinish={(values) => onSearch?.(values.search)}
      >
        <Form.Item name="search">
          <InputCustom
            placeholder={searchPlaceholder}
            className="h-10 max-w-lg rounded-md sm:w-[300px]"
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="flex h-10 w-10 items-center !bg-primary"
          >
            <SearchOutlined className="align-middle text-white" />
          </Button>
        </Form.Item>
      </Form>

      <Button className="h-10 !bg-primary" onClick={onAddClick}>
        <UserAddOutlined className="mr-1 text-lg text-white" />
        <span className="font-medium text-white">{addButtonText}</span>
      </Button>
    </div>
  );
};

export { SearchAndAdd };
