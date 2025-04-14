import { Metadata } from "next";
import { PostDetail } from "../components";

export const metadata: Metadata = {
  title: "MoneyEz | Chi tiết bài viết",
  description: "Chi tiết bài viết trong hệ thống",
};

const PostDetailPage = () => {
  return <PostDetail />;
};

export default PostDetailPage;
