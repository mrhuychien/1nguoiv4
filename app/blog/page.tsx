import type { Metadata } from "next";
import BlogIndex from "../components/BlogIndex";
import { InnerHeader, SiteFooter } from "../components/GlobalChrome";

export const metadata: Metadata = {
  title: "Bài viết",
  description: "Nhật ký xây hệ thống, triển khai ERP, tự động hóa và học cách làm việc tốt hơn.",
};

export default function BlogPage() {
  return (
    <main className="inner-shell" id="top">
      <InnerHeader />
      <BlogIndex />
      <SiteFooter />
    </main>
  );
}
