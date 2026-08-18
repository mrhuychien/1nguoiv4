import type { Metadata } from "next";
import { InnerHeader, SiteFooter } from "../components/GlobalChrome";
import WritingStudio from "../components/WritingStudio";

export const metadata: Metadata = { title: "Bàn viết", description: "Không gian soạn và xem trước bài viết cho 1nguoi.com." };

export default function StudioPage() {
  return <main className="inner-shell studio-shell" id="top"><InnerHeader /><WritingStudio /><SiteFooter /></main>;
}
