"use client";

import Star from "@/assets/images/icons/star.png";
import Image from "next/image";
import { CountupCustom } from "../common/Countup";
import { ScrollReveal } from "../ScrollReveal";

const Statistic = () => {
  const stats = [
    {
      id: 1,
      value: <CountupCustom value={20} />,
      label: "Người dùng",
    },
    {
      id: 2,
      value: <CountupCustom value={10} />,
      label: "NHÓM",
    },
    {
      id: 3,
      value: <CountupCustom value={2} />,
      label: "MÔ HÌNH CHI TIÊU",
    },
    {
      id: 4,
      value: <CountupCustom value={90} />,
      label: "TỶ LỆ HÀI LÒNG (%)",
    },
  ];

  return (
    <section className="my-32 px-5 text-center">
      <ScrollReveal type="fadeUp" duration={0.8} distance={50}>
        <div className="mb-3 flex justify-center">
          <div className="flex items-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
            <Image src={Star} alt="star" quality={100} width={20} height={20} />
            <p className="text-sm font-semibold text-[#fca61b]">
              Thông số ấn tượng
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
          Thống kê
        </h1>
      </ScrollReveal>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <ScrollReveal
            key={stat.id}
            type="fadeUp"
            delay={index * 0.1}
            distance={90}
            duration={1}
          >
            <div className="group relative flex flex-col items-center overflow-hidden rounded-t-[30px] p-8 shadow-soft-green transition-all duration-300 before:absolute before:inset-0 before:origin-left before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 hover:before:scale-y-100 md:p-12">
              <div className="relative z-10 mb-4 flex flex-col items-center gap-3 md:mb-0">
                <div className="mt-2 flex items-center gap-x-1 text-3xl font-bold text-primary transition-all duration-500 group-hover:text-white md:text-4xl">
                  <span>{stat.value}</span>
                  <span className="text-2xl md:text-3xl">+</span>
                </div>
                <p className="text-sm text-gray-500 transition-all duration-500 group-hover:text-white md:text-base">
                  {stat.label}
                </p>
              </div>
              <div className="absolute bottom-0 h-[3px] w-full bg-primary transition-all duration-500 group-hover:bg-white" />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export { Statistic };
