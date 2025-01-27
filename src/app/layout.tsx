import { LoadingWrapper, NextProgressBar } from "@/components";
import { Providers } from "@/redux/provider";
import { Roboto_Slab } from "next/font/google";
import { Toaster } from "sonner";
import ClientLayout from "./auth/layout";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-robotoSlab",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.variable}`}>
        <LoadingWrapper>
          <NextProgressBar />
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
          <Toaster position="top-right" richColors />
        </LoadingWrapper>
      </body>
    </html>
  );
}
