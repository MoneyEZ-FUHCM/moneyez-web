import { Metadata } from "next";
import { CategoryDetail } from "../components/CategoryDetail";

export const metadata: Metadata = {
  title: "EzMoney | Chi tiết danh mục chi tiêu",
  description: "Chi tiết danh mục chi tiêu trong hệ thống",
};

const CategoryDetailPage = () => {
  return <CategoryDetail />;
};

export default CategoryDetailPage;
