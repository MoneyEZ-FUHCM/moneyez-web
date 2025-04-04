import { Metadata } from "next";
import QuizCreator from "./components/QuizCreator";

export const metadata: Metadata = {
  title: "EzMoney | Quản lý câu hỏi",
  description: "Tạo và quản lý câu hỏi cho hệ thống",
};

const UserManagement = () => {
  return <QuizCreator />;
};

export default UserManagement;
