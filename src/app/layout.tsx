import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DynamicProvider from "./ClientComponents";
import { Noto_Sans_Bengali } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({ subsets: ["bengali"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mlm websites",
  description: "Generated for business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.className} antialiased`}
        suppressHydrationWarning
      >
          <DynamicProvider>
          {children}
          </DynamicProvider>
      
      </body>
    </html>
  );
}
