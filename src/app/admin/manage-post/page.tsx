import { Metadata } from "next";
import { PostList } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý bài viết",
  description: "Theo dõi, quản lý bài viết trong hệ thống",
};

const PostManagement = () => {
  return <PostList />;
};

export default PostManagement;
