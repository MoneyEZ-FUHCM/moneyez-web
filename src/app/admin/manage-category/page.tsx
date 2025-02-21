import { Metadata } from "next";
import { CategoryList } from "./components/CategoryList";
import { SubCategoryList } from "./components/SubCategoryList";
import { Tabs } from "antd";
import { TEXT_TRANSLATE } from "./category.translate";

export const metadata: Metadata = {
  title: "EzMoney | Quản lý danh mục chi tiêu",
  description: "Theo dõi, quản lý danh mục chi tiêu trong hệ thống",
};

const CategoryManagement = () => {
  const { TITLE } = TEXT_TRANSLATE;
  
  const items = [
    {
      key: '1',
      label: TITLE.MAIN_CATEGORY_TAB,
      children: <CategoryList />,
    },
    {
      key: '2',
      label: TITLE.SUB_CATEGORY_TAB,
      children: <SubCategoryList />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      className="bg-white p-6 rounded-xl"
    />
  );
};

export default CategoryManagement;
