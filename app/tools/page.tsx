import type { Metadata } from "next";
import Link from "next/link";
import { InnerHeader, SiteFooter } from "../components/GlobalChrome";
import { toolsDirectory } from "../content";

export const metadata: Metadata = {
  title: "Công cụ",
  description: "Các công cụ nhỏ về ERP, vận hành, tự động hóa và năng lực số dành cho doanh nghiệp.",
};

export default function ToolsPage() {
  return (
    <main className="inner-shell tools-page" id="top">
      <InnerHeader />
      <section className="tools-hero">
        <div>
          <p className="section-code">TOOLBOX / OPEN ACCESS</p>
          <h1>Ý tưởng tốt hơn<br />khi <em>dùng được.</em></h1>
          <p>Một kho công cụ nhỏ để đánh giá, suy nghĩ và ra quyết định nhanh hơn — được xây từ những bài toán vận hành thật.</p>
        </div>
        <div className="toolbox-visual" aria-hidden="true"><span>⌘</span><i>ERP</i><i>AI</i><i>OPS</i><i>BI</i></div>
      </section>

      <section className="tools-directory">
        <div className="directory-head"><span>{String(toolsDirectory.length).padStart(2, "0")} CÔNG CỤ</span><i>CẬP NHẬT LIÊN TỤC</i></div>
        <div className="directory-grid">
          {toolsDirectory.map((tool, index) => {
            const content = (
              <>
                <div className="directory-card-top"><span>{String(index + 1).padStart(2, "0")}</span><i>{tool.status}</i></div>
                <div className={`directory-symbol accent-${tool.accent}`}>{tool.symbol}</div>
                <span className="directory-category">{tool.category}</span>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                <b>{tool.status === "Dùng ngay" ? "MỞ CÔNG CỤ ↗" : "SẮP RA MẮT"}</b>
              </>
            );
            return tool.status === "Dùng ngay" ? (
              <Link className="directory-card" href={`/tools/${tool.slug}`} key={tool.slug}>{content}</Link>
            ) : (
              <article className="directory-card is-coming" key={tool.slug}>{content}</article>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
