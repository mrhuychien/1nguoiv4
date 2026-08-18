import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "1 NGƯỜI — Nguyễn Huy Chiến",
    template: "%s — 1 NGƯỜI",
  },
  description: "Câu chuyện về một người làm vận hành, xây ERP, thử nghiệm AI và chia sẻ những công cụ giúp công việc tốt hơn.",
  metadataBase: new URL("https://1nguoi.com"),
  openGraph: {
    title: "1 NGƯỜI — Nguyễn Huy Chiến",
    description: "Một người. Nhiều vai. Một hệ thống.",
    type: "website",
    locale: "vi_VN",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e9f0f4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
