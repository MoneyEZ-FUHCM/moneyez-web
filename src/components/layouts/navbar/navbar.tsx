"use client";

import Image from "next/image";
import LogoWeb from "@/assets/images/logo/logo_web.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PATH_NAME } from "@/helpers/constants/pathname";

const Navbar = () => {
  const router = useRouter();
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <section
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-700 ${isScrollingUp ? "translate-y-0" : "-translate-y-full"} ${lastScrollY > 0 ? "bg-white shadow-md" : ""}`}
    >
      <div className="container mx-auto flex min-h-9 items-center justify-between py-3 transition-all duration-500">
        <Image
          src={LogoWeb}
          alt="logo-web"
          height={100}
          width={100}
          quality={100}
        />
        <div className="items-center gap-5 lg:flex">
          <button
            onClick={() => router.push(PATH_NAME.AUTH)}
            className="translate transform rounded-xl bg-[#e5f4f2] px-10 py-4 text-sm font-semibold text-[#009379] transition-all duration-200 active:scale-95 lg:block"
          >
            Đăng nhập
          </button>
          <button className="translate hidden transform rounded-xl bg-[#009379] px-10 py-4 text-sm font-semibold text-white transition-all duration-200 active:scale-95 lg:block">
            🚀 Trải nghiệm ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
