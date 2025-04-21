import { Metadata } from "next";
import { KnowledgeList } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý tài liệu chatbot",
  description: "Theo dõi, quản lý tài liệu chatbot trong hệ thống",
};

const KnowledgeManagement = () => {
  return <KnowledgeList />;
};

export default KnowledgeManagement;
