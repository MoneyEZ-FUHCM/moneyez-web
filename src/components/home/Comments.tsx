"use client";

import An from "@/assets/images/avatar/an_avatar.jpg";
import Bao from "@/assets/images/avatar/bao_avatar.png";
import Duc from "@/assets/images/avatar/duc_avatar.jpg";
import Hieu from "@/assets/images/avatar/hieu_avatar.jpg";
import Huyen from "@/assets/images/avatar/huyen_avatar.jpg";
import Linh from "@/assets/images/avatar/linh_avatar.jpg";
import Sang from "@/assets/images/avatar/sang_avatar.jpg";
import Tri from "@/assets/images/avatar/tri_avatar.jpg";
import Rating4 from "@/assets/images/icons/4star.png";
import Rating from "@/assets/images/icons/rating.png";
import Star from "@/assets/images/icons/star.png";
import Image from "next/image";
import { ScrollReveal } from "../ScrollReveal";

const Comments = () => {
  const feedbacks = [
    {
      id: 3,
      name: "Gia Đức",
      role: "Quản lý",
      avatar: Duc,
      feedback:
        "Mình hay dùng hũ tiết kiệm trong app để dành tiền mua laptop. Nhìn số tiền tăng dần mỗi tuần cảm giác rất có động lực để góp quỹ nhiều hơn!",
      rating: Rating4,
    },
    {
      id: 1,
      name: "Tôn Bảo",
      role: "Công nhân",
      avatar: Bao,
      feedback:
        "Tính năng góp quỹ nhóm quá tiện! Mình và bạn bè cùng tiết kiệm cho chuyến du lịch hè, giờ ai đóng bao nhiêu đều rõ ràng minh bạch.",
      rating: Rating4,
    },
    {
      id: 2,
      name: "Thương Huyền",
      role: "Nội trợ",
      avatar: Huyen,
      feedback:
        "Ứng dụng rất dễ dùng, có thể phân loại chi tiêu theo từng nhóm như ăn uống, mua sắm, học hành... Nhờ vậy mình kiểm soát được ngân sách tốt hơn.",
      rating: Rating,
    },
    {
      id: 4,
      name: "Minh Trí",
      role: "Kỹ sư",
      avatar: Tri,
      feedback:
        "Điều mình thích nhất là tính năng chatbot nhập chi tiêu siêu nhanh. Chỉ cần gõ 'ăn trưa 45k', không cần chọn danh mục hay ngày giờ gì cả, quá tiện!",
      rating: Rating,
    },
    {
      id: 5,
      name: "Nhật Linh",
      role: "Giáo viên",
      avatar: Linh,
      feedback:
        "App ghi chi tiêu cực nhanh bằng cách nhắn tin, hỗ trợ tạo giao dịch định kỳ cho các khoản cố định và có thống kê chi tiết giúp theo dõi chi tiêu rõ ràng, dễ dàng.",
      rating: Rating,
    },
    {
      id: 6,
      name: "Nhật Sang",
      role: "Sinh viên",
      avatar: Sang,
      feedback:
        "Tính năng tạo giao dịch định kỳ cho các khoản chi cố định thật sự rất hữu ích cho mình. Giờ mình không còn lo lắng về việc bỏ sót chi phí hàng tháng.",
      rating: Rating,
    },
    {
      id: 7,
      name: "Tuấn Hiếu",
      role: "Bác sĩ",
      avatar: Hieu,
      feedback:
        "Ứng dụng cho phép theo dõi chi tiêu và tiết kiệm một cách hiệu quả. Tính năng thông báo nhắc nhở mỗi tuần giúp mình không bỏ lỡ bất kỳ mục chi tiêu nào.",
      rating: Rating,
    },
    {
      id: 8,
      name: "Minh An",
      role: "Streamer",
      avatar: An,
      feedback:
        "Ứng dụng này rất phù hợp với công việc của mình. Mình có thể theo dõi chi tiêu và thu nhập từ các nguồn khác nhau một cách dễ dàng, giúp mình quản lý tài chính tốt hơn.",
      rating: Rating,
    },
  ];

  return (
    <section className="my-32 px-5 text-center">
      <ScrollReveal type="zoom" duration={0.8} distance={50}>
        <div className="mb-3 flex justify-center">
          <div className="flex items-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
            <Image src={Star} alt="star" quality={100} width={20} height={20} />
            <p className="text-sm font-semibold text-[#fca61b]">Sự hài lòng</p>
          </div>
        </div>
        <h1 className="text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
          Đánh giá từ khách hàng
        </h1>
      </ScrollReveal>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {feedbacks.map((feedback, index) => (
          <ScrollReveal
            key={feedback.id}
            type="zoom"
            delay={index * 0.3}
            duration={0.8}
            distance={50}
            stagger
          >
            <div className="relative my-5 flex min-h-80 flex-col items-center rounded-3xl p-6 shadow-soft-green transition-all duration-300 md:p-8">
              <Image
                src={feedback.avatar}
                alt={feedback.name}
                quality={100}
                className="absolute -top-6 size-16 rounded-full bg-white object-cover"
              />
              <h2 className="text-[#4d4d4d]md:text-xl mt-4 text-lg font-semibold">
                {feedback.name}
              </h2>
              <p className="text-[12px] text-gray-500 md:text-sm">
                {feedback.role}
              </p>
              <p className="my-5 break-words text-sm italic text-gray-500 md:text-base">
                "{feedback.feedback}"
              </p>
              <Image
                src={feedback.rating}
                alt="star"
                quality={100}
                className="absolute bottom-5 mt-5 w-40 lg:w-56 2xl:w-60"
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export { Comments };
