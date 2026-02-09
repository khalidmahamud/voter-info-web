import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bengali',
});

export const metadata: Metadata = {
  title: "Voter Information System | ভোটার তথ্য সিস্টেম",
  description: "Search and browse voter information from Dharmpur, Sitakunda, Chittagong",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className="bengali-text antialiased">
        {children}
      </body>
    </html>
  );
}
