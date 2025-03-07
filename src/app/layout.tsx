import { LoadingWrapper, NextProgressBar, ProgressBar } from "@/components";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Providers } from "@/redux/provider";
import { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import useUserInfo from "@/hooks/useUserInfo";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-robotoSlab",
});

export const metadata: Metadata = {
  title: "EzMoney | Trang chủ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.variable}`}>
        <Providers>
          <LoadingWrapper>
            <NextProgressBar />
            <NavbarWrapper>{children}</NavbarWrapper>
            <ProgressBar />
            <Toaster position="top-right" richColors />
          </LoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
