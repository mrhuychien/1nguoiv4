"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { posts } from "../content";

export default function BlogIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const categories = ["Tất cả", ...Array.from(new Set(posts.map((post) => post.category)))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return posts.filter((post) => {
      const matchesCategory = category === "Tất cả" || post.category === category;
      const matchesQuery = !normalized || `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase("vi").includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <>
      <section className="archive-hero">
        <div className="archive-edition"><span>1NGUOI.COM</span><span>INDEPENDENT FIELD NOTES</span><span>VOL. 01 / 2026</span></div>
        <div className="archive-title-row">
          <h1>Nhật ký<br /><span>hệ thống.</span></h1>
          <div><b>EDITOR&apos;S NOTE</b><p>Những ghi chép từ công việc thật: ERP, vận hành, AI, tự động hóa và hành trình học cách xây hệ thống.</p></div>
        </div>
        <div className="archive-ticker" aria-hidden="true">FIELD NOTES • SYSTEMS • ERP • AI • OPERATIONS • FIELD NOTES • SYSTEMS • ERP • AI • OPERATIONS •</div>
      </section>

      <section className="archive-content">
        <div className="archive-controls">
          <label>
            <span>TÌM TRONG NHẬT KÝ</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Gõ một từ khóa..." />
            <i>⌕</i>
          </label>
          <div className="category-filter" aria-label="Lọc theo chủ đề">
            {categories.map((item) => (
              <button className={item === category ? "is-active" : ""} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="archive-count"><span>{String(filtered.length).padStart(2, "0")} BÀI VIẾT</span><i>THEO THỨ TỰ MỚI NHẤT ↓</i></div>
        <div className="archive-grid">
          {filtered.map((post, index) => (
            <Link className={`archive-card emag-card accent-${post.accent} ${index === 0 ? "is-featured" : ""}`} href={`/blog/${post.slug}`} key={post.slug}>
              <div className="archive-card-top"><strong>1 NGƯỜI</strong><span>ISSUE {post.number}</span><i>{post.category}</i></div>
              <div className="archive-cover-art">
                <span>{post.metric}</span>
                <img src={post.coverImage} alt="" width="1024" height="1536" loading="lazy" />
                <i>{post.metricLabel}</i>
              </div>
              <div className="archive-card-body">
                <div><span>{post.date}</span><span>{post.readTime}</span></div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <span className="archive-arrow">MỞ ISSUE ↗</span>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state"><span>00</span><h2>Chưa tìm thấy bài phù hợp.</h2><button type="button" onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
      </section>
    </>
  );
}
