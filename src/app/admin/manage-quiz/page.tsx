"use client";

import { ButtonCustom } from "@/components/ui/button";
import { InputCustom } from "@/components/ui/input";
import { TextareaCustom } from "@/components/ui/textarea";
import { QUIZ_ASSIGN_STATUS, TOAST_STATUS } from "@/enums/globals";
import { showToast } from "@/hooks/useShowToast";
import {
  useActiveQuestionMutation,
  useCreateQuizMutation,
  useDeleteQuestionsMutation,
  useGetQuizListQuery,
  useUpdateQuizMutation,
} from "@/services/admin/quiz";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Badge, Button, Divider, Popconfirm } from "antd";
import { useState } from "react";

interface Quiz {
  title: string;
  description: string;
  status: number;
  questions: {
    content: string;
    answerOptions: { content: string; type: string }[];
  }[];
  createdAt: Date;
}

const Card = ({ children, title, extra, className = "" }) => (
  <div
    className={`overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md ${className}`}
  >
    {(title || extra) && (
      <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
        {title && (
          <div className="text-lg font-medium text-gray-800">{title}</div>
        )}
        {extra && <div>{extra}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const BadgeCustom = ({ count, className = "" }) => {
  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white ${className}`}
    >
      {count}
    </span>
  );
};

// Icons
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Main Component
const QuizCreator = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    status: 0,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    content: "",
    answerOptions: [
      { content: "", type: "STATIC" },
      { content: "", type: "STATIC" },
    ],
  });

  const { data: quizList } = useGetQuizListQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...currentQuestion.answerOptions];
    newAnswers[index].content = e.target.value;
    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: newAnswers,
    }));
  };

  const addAnswer = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: [...prev.answerOptions, { content: "", type: "STATIC" }],
    }));
  };

  const removeAnswer = (index) => {
    if (currentQuestion.answerOptions.length <= 2) return; // Minimum 2 options

    const newAnswers = [...currentQuestion.answerOptions];
    newAnswers.splice(index, 1);

    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: newAnswers,
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.content.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập nội dung câu hỏi");
      return;
    }

    // Check if all answers have content
    const allAnswersHaveContent = currentQuestion.answerOptions.every(
      (option) => option.content.trim(),
    );
    if (!allAnswersHaveContent) {
      showToast(
        TOAST_STATUS.INFO,
        "Vui lòng nhập nội dung cho tất cả các câu hỏi",
      );
      return;
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, currentQuestion],
    }));

    // Reset current question
    setCurrentQuestion({
      content: "",
      answerOptions: [
        { content: "", type: "STATIC" },
        { content: "", type: "STATIC" },
      ],
    });

    showToast(TOAST_STATUS.SUCCESS, "Đã thêm câu hỏi vào bộ câu hỏi");
  };

  const removeQuestion = (index) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);
    setQuiz((prev) => ({
      ...prev,
      questions: newQuestions,
    }));

    showToast(TOAST_STATUS.SUCCESS, "Đã xóa câu hỏi");
  };

  const createNewQuiz = () => {
    setSelectedQuiz(null);
    setIsEditing(false);
    setQuiz({
      title: "",
      description: "",
      status: 0,
      questions: [],
    });
  };

  const updateQuiz = async () => {
    if (!quiz.title.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập tiêu đề bộ câu hỏi");
      return;
    }

    if (quiz.questions.length === 0) {
      showToast(TOAST_STATUS.INFO, "bộ câu hỏi cần có ít nhất một câu hỏi");
      return;
    }
    console.log("check selectedQuiz", selectedQuiz);
    const newQuiz = {
      ...quiz,
      id: selectedQuiz,
    };
    try {
      await updateQuizList(newQuiz).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Đã cập nhật bộ câu hỏi thành công");
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã cập nhật bộ câu hỏi thất bại");
      return;
    }

    showToast(TOAST_STATUS.SUCCESS, "Đã cập nhật bộ câu hỏi thành công");
  };

  const toggleActive = async (quizId) => {
    if (quizId !== selectedQuiz) {
      showToast(TOAST_STATUS.INFO, "Vui lòng chọn bộ câu hỏi trước khi active");
      return;
    }

    const targetQuiz = quizList?.data?.find((q) => q.id === quizId);
    if (targetQuiz?.status === QUIZ_ASSIGN_STATUS.ACTIVE) {
      showToast(TOAST_STATUS.INFO, "bộ câu hỏi này đã được active");
      return;
    }
    try {
      await activeQuestion(quizId).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Đã active bộ câu hỏi thành công");
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã lưu bộ câu hỏi thất bại");
      return;
    }
  };

  const [createQuiz] = useCreateQuizMutation();
  const [updateQuizList] = useUpdateQuizMutation();
  const [activeQuestion] = useActiveQuestionMutation();
  const [deleteQuizList] = useDeleteQuestionsMutation();

  const saveQuiz = async () => {
    if (!quiz.title.trim()) {
      showToast(TOAST_STATUS.INFO, "Vui lòng nhập tiêu đề bộ câu hỏi");
      return;
    }

    if (quiz.questions.length === 0) {
      showToast(TOAST_STATUS.INFO, "bộ câu hỏi cần có ít nhất một câu hỏi");
      return;
    }

    // Create new quiz with unique ID
    const newQuiz = {
      ...quiz,
    };

    try {
      await createQuiz(newQuiz).unwrap();
      setIsEditing(false);
      setSelectedQuiz(null);

      showToast(TOAST_STATUS.SUCCESS, "Tạo bộ câu hỏi thành công");
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã lưu bộ câu hỏi thất bại");
      return;
    }

    // Reset form
    setQuiz({
      title: "",
      description: "",
      status: 0,
      questions: [],
    });

    setIsEditing(false);
    setSelectedQuiz(null);

    showToast(TOAST_STATUS.SUCCESS, "Đã lưu bộ câu hỏi thành công");
  };

  const selectQuiz = (id) => {
    const found = quizList?.data?.find((q) => q.id === id);

    if (found) {
      setSelectedQuiz(id);
      setIsEditing(true);
      setQuiz({
        title: found.title,
        description: found.description,
        status: found.status,
        questions: found.questions,
      });
    }
  };

  // Handle quiz deletion
  const handleDeleteQuiz = async (id, e) => {
    // Stop event propagation to prevent selection of the quiz
    e.stopPropagation();

    // Here you would typically call your delete API
    // For now, we'll just log the ID
    console.log("Deleting quiz with ID:", id);
    try {
      await deleteQuizList(id).unwrap();
      showToast(TOAST_STATUS.SUCCESS, `Đã xóa bộ câu hỏi với ID: ${id}`);
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, "Đã lưu bộ câu hỏi thất bại");
      return;
    }

    // If the deleted quiz is currently selected, reset the form
    if (selectedQuiz === id) {
      setSelectedQuiz(null);
      setIsEditing(false);
      setQuiz({
        title: "",
        description: "",
        status: 0,
        questions: [],
      });
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Quiz List */}
      <div className="h-[82vh] w-2/5 overflow-hidden border-r border-[#E1EACD] bg-white shadow-sm">
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white p-4 pb-4">
            <h2 className="text-xl font-bold text-primary">
              Danh sách bộ câu hỏi
            </h2>
            <div className="flex space-x-3">
              <ButtonCustom
                onClick={createNewQuiz}
                className="flex h-10 items-center gap-x-2 rounded-lg bg-primary px-4 text-white shadow-sm transition-all hover:bg-[#4d766d]"
              >
                <PlusCircleOutlined className="text-lg" />
                <span className="font-medium">Tạo mới</span>
              </ButtonCustom>

              <ButtonCustom
                onClick={() => selectedQuiz && toggleActive(selectedQuiz)}
                className={`flex h-10 items-center gap-x-2 rounded-lg border px-4 shadow-sm transition-all ${
                  selectedQuiz
                    ? "border-primary bg-transparent text-primary hover:bg-[#E1EACD]"
                    : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                }`}
                disabled={!selectedQuiz}
              >
                <CheckCircleOutlined
                  className={
                    selectedQuiz
                      ? "text-lg text-primary"
                      : "text-lg text-gray-400"
                  }
                />
                <span className="font-medium">Áp dụng</span>
              </ButtonCustom>
            </div>
          </div>

          <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              {quizList?.data?.map((q) =>
                q?.status === QUIZ_ASSIGN_STATUS.ACTIVE ? (
                  <Badge.Ribbon key={q.id} text="Đã áp dụng" color="#609084">
                    <div
                      className={`group relative cursor-pointer rounded-xl border p-5 transition-all hover:border-[#BAD8B6] hover:bg-thirdly/20 ${
                        selectedQuiz === q.id
                          ? "border-secondary bg-thirdly/20 ring-1 ring-[#BAD8B6]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {/* Delete Button */}
                      <Popconfirm
                        title="Xóa bộ câu hỏi"
                        description="Bạn có chắc chắn muốn xóa bộ câu hỏi này?"
                        onConfirm={(e) => handleDeleteQuiz(q.id, e)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="absolute right-2 top-1/3 z-10 flex h-8 w-8 items-center justify-center !border-none !bg-white/80 !p-1 opacity-0 !shadow-none transition-opacity hover:!bg-red/10 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>

                      {/* Quiz Content - Wrapped in a div to handle click event */}
                      <div onClick={() => selectQuiz(q.id)}>
                        <div className="mb-3 flex items-center justify-between">
                          <h3
                            className={`text-lg font-medium ${selectedQuiz === q.id ? "text-primary" : "text-gray-800"}`}
                          >
                            {q?.title}
                          </h3>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                          {q?.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-[#EBEFD6] pt-3">
                          <p className="flex items-center text-xs font-medium text-gray-500">
                            <CalendarOutlined className="mr-2" />
                            {new Date(q?.createdAt).toLocaleDateString()}
                          </p>

                          <div className="flex items-center gap-1 rounded-full bg-secondary/30 px-3 py-1 text-xs font-medium text-primary">
                            <SolutionOutlined />
                            {q?.questions?.length} câu hỏi
                          </div>
                        </div>
                      </div>
                    </div>
                  </Badge.Ribbon>
                ) : (
                  <div
                    key={q.id}
                    className={`group relative cursor-pointer rounded-xl border p-5 transition-all hover:border-[#BAD8B6] hover:bg-thirdly/20 ${
                      selectedQuiz === q.id
                        ? "border-secondary bg-thirdly/20 ring-1 ring-[#BAD8B6]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* Delete Button */}
                    <Popconfirm
                      title="Xóa bộ câu hỏi"
                      description="Bạn có chắc chắn muốn xóa bộ câu hỏi này?"
                      onConfirm={(e) => handleDeleteQuiz(q.id, e)}
                      okText="Xóa"
                      cancelText="Hủy"
                      placement="topRight"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center !border-none !bg-white/80 !p-1 opacity-0 !shadow-none transition-opacity hover:!bg-red/10 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>

                    {/* Quiz Content - Wrapped in a div to handle click event */}
                    <div onClick={() => selectQuiz(q.id)}>
                      <div className="mb-3 flex items-center justify-between">
                        <h3
                          className={`text-lg font-medium ${selectedQuiz === q.id ? "text-primary" : "text-gray-800"}`}
                        >
                          {q?.title}
                        </h3>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {q?.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[#EBEFD6] pt-3">
                        <p className="flex items-center text-xs font-medium text-gray-500">
                          <CalendarOutlined className="mr-2" />
                          {new Date(q?.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex items-center gap-1 rounded-full bg-secondary/30 px-3 py-1 text-xs font-medium text-primary">
                          <SolutionOutlined />
                          {q?.questions?.length} câu hỏi
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Quiz Editor */}
      <div className="h-[82vh] w-3/5 overflow-y-auto bg-light/50 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Quiz Details */}
          <Card
            className="bg-white"
            title={
              <div className="flex items-center text-primary">
                <EditOutlined className="mr-2" />
                Tạo bộ câu hỏi
              </div>
            }
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Tiêu đề
                </label>
                <InputCustom
                  name="title"
                  value={quiz.title}
                  onChange={handleQuizChange}
                  placeholder="Nhập tiêu đề bộ câu hỏi"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Mô tả
                </label>
                <TextareaCustom
                  name="description"
                  value={quiz.description}
                  onChange={handleQuizChange}
                  placeholder="Nhập mô tả chi tiết về bộ câu hỏi"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                  rows={4}
                />
              </div>
            </div>
          </Card>

          {/* Existing Questions */}
          {quiz.questions.length > 0 && (
            <Card
              className="bg-white"
              title={
                <div className="flex w-full items-center text-primary">
                  <div>
                    <QuestionCircleOutlined className="mr-2" />
                    Danh sách câu hỏi
                  </div>
                  <BadgeCustom
                    count={quiz.questions.length}
                    className="ml-2 bg-primary"
                  />
                </div>
              }
            >
              <div className="space-y-5">
                {quiz.questions.map((question, qIndex) => (
                  <Card
                    key={qIndex}
                    className="border-gray-200 shadow-sm transition-all hover:shadow"
                    title={
                      <div className="flex items-center space-x-2 text-gray-800">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E1EACD] text-sm font-medium text-primary">
                          {qIndex + 1}
                        </span>
                        <span className="font-medium">
                          Câu hỏi {qIndex + 1}
                        </span>
                      </div>
                    }
                    extra={
                      <Button
                        onClick={() => removeQuestion(qIndex)}
                        danger
                        type="text"
                        size="small"
                        className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
                        icon={<DeleteOutlined className="text-red" />}
                      />
                    }
                  >
                    <p className="mb-4 text-base text-gray-800">
                      {question.content}
                    </p>
                    <Divider className="my-4" />
                    <div className="grid grid-cols-2 gap-3">
                      {question.answerOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-lg bg-secondary/30 p-3 text-base text-gray-700 transition-colors"
                        >
                          <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white font-medium text-gray-700 shadow-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option.content}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Add New Question */}
          <Card
            className="bg-white"
            title={
              <div className="flex items-center text-primary">
                <PlusCircleOutlined className="mr-2" />
                Thêm câu hỏi mới
              </div>
            }
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Nội dung câu hỏi
                </label>
                <InputCustom
                  value={currentQuestion.content}
                  onChange={handleQuestionChange}
                  placeholder="Nhập nội dung câu hỏi"
                  className="w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <Divider orientation="left" className="my-6">
                <span className="text-sm font-medium text-gray-500">
                  Các lựa chọn
                </span>
              </Divider>

              <div className="space-y-4">
                <label className="block text-base font-semibold text-gray-700">
                  <span className="text-red">*</span> Lựa chọn
                </label>

                {currentQuestion.answerOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E1EACD] text-sm font-medium text-primary">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-grow">
                      <InputCustom
                        value={option.content}
                        onChange={(e) => handleAnswerChange(index, e)}
                        placeholder={`Nhập lựa chọn ${index + 1}`}
                        className="w-full rounded-lg border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <Button
                      onClick={() => removeAnswer(index)}
                      type="text"
                      disabled={currentQuestion.answerOptions.length <= 2}
                      className="flex h-8 w-8 items-center justify-center rounded-full !border-none !bg-transparent"
                      icon={<CloseOutlined className="text-red" />}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <Button
                  type="dashed"
                  onClick={addAnswer}
                  icon={<PlusIcon />}
                  className="flex items-center border-primary text-primary hover:border-[#4d766d] hover:text-[#4d766d]"
                >
                  Thêm lựa chọn
                </Button>

                <ButtonCustom
                  onClick={addQuestion}
                  disabled={!currentQuestion.content.trim()}
                  className="flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-[#4d766d] disabled:bg-gray-300"
                >
                  <PlusIcon />
                  <span>Thêm câu hỏi</span>
                </ButtonCustom>
              </div>
            </div>
          </Card>

          {/* Save Quiz Button */}
          <div className="mt-8 flex justify-center">
            <ButtonCustom
              onClick={isEditing ? updateQuiz : saveQuiz}
              disabled={quiz.questions.length === 0 || !quiz.title.trim()}
              className="flex h-12 items-center gap-x-2 rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white shadow-md hover:bg-[#4d766d] disabled:bg-gray-300"
            >
              <SaveOutlined className="text-xl" />
              {isEditing ? "Cập nhật bộ câu hỏi" : "Lưu bộ câu hỏi"}
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
