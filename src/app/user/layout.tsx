import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoneyEz | Người dùng",
  description: "Generated by create next app",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
