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
        <p className="section-code dark-code">ARCHIVE / WRITING</p>
        <div className="archive-title-row">
          <h1>Ghi lại để<br /><span>nghĩ rõ hơn.</span></h1>
          <p>Những ghi chép từ công việc thật: ERP, vận hành, AI, tự động hóa và hành trình học cách xây hệ thống.</p>
        </div>
        <div className="archive-ticker" aria-hidden="true">BLOG • NOTES • SYSTEMS • ERP • AI • OPERATIONS • BLOG • NOTES • SYSTEMS • ERP • AI • OPERATIONS •</div>
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
            <Link className={`archive-card accent-${post.accent}`} href={`/blog/${post.slug}`} key={post.slug}>
              <div className="archive-card-top"><span>{post.number}</span><i>{post.category}</i></div>
              <div className="archive-orb" aria-hidden="true"><b>{index + 1}</b></div>
              <div className="archive-card-body">
                <div><span>{post.date}</span><span>{post.readTime}</span></div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <span className="archive-arrow">↗</span>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state"><span>00</span><h2>Chưa tìm thấy bài phù hợp.</h2><button type="button" onClick={() => { setQuery(""); setCategory("Tất cả"); }}>Xóa bộ lọc</button></div>}
      </section>
    </>
  );
}
