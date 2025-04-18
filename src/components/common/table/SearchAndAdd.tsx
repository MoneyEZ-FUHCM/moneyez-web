import { InputCustom } from "@/components/ui/input";
import {
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Form } from "antd";

interface SearchAndAddProps {
  searchPlaceholder?: string;
  addButtonText: string;
  onSearch?: (value: string) => void;
  onAddClick: () => void;
  isAddButton?: boolean;
}

const SearchAndAdd = ({
  searchPlaceholder = "Tìm kiếm...",
  addButtonText,
  onSearch,
  onAddClick,
  isAddButton = true,
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

      {isAddButton && (
        <Button
          className="flex h-10 items-center !bg-primary"
          onClick={onAddClick}
        >
          <PlusCircleOutlined className="text-lg text-white" />
          <span className="font-medium text-white">{addButtonText}</span>
        </Button>
      )}
    </div>
  );
};

export { SearchAndAdd };
