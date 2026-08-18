"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const destinations = [
  { label: "Trang chủ", href: "/", code: "H" },
  { label: "Hành trình ERP", href: "/#erp", code: "E" },
  { label: "Dự án", href: "/#work", code: "W" },
  { label: "Bài viết", href: "/blog", code: "B" },
  { label: "Công cụ", href: "/tools", code: "T" },
  { label: "Bàn viết", href: "/studio", code: "S" },
];

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />;
}

export function InnerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ScrollProgress />
      <header className="inner-header">
        <Link className="brand-mark" href="/" aria-label="1 Người — Trang chủ">
          <span>1</span><span>NGƯỜI</span>
        </Link>
        <nav className={menuOpen ? "inner-nav is-open" : "inner-nav"} aria-label="Điều hướng chính">
          {destinations.slice(1, 5).map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
          ))}
        </nav>
        <div className="inner-actions">
          <button className="command-button" type="button" onClick={() => setPaletteOpen(true)}>
            <span>Tìm nhanh</span><kbd>⌘ K</kbd>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          ><span /><span /></button>
        </div>
      </header>

      {paletteOpen && (
        <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Điều hướng nhanh" onMouseDown={() => setPaletteOpen(false)}>
          <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
            <div className="command-title"><span>COMMAND / GO TO</span><button type="button" onClick={() => setPaletteOpen(false)}>ESC</button></div>
            <div className="command-list">
              {destinations.map((item, index) => (
                <Link key={item.href} href={item.href} onClick={() => setPaletteOpen(false)}>
                  <span><i>{String(index + 1).padStart(2, "0")}</i>{item.label}</span>
                  <kbd>{item.code}</kbd>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-orbit" aria-hidden="true"><span>1</span></div>
      <p className="section-code">END — NHƯNG CHƯA KẾT THÚC</p>
      <h2>Cùng làm một việc<br />tốt hơn mỗi ngày.</h2>
      <div className="footer-links">
        <Link href="/blog">Đọc blog <span>↗</span></Link>
        <Link href="/tools">Dùng công cụ <span>↗</span></Link>
        <Link href="/studio">Bàn viết <span>↗</span></Link>
        <a href="https://github.com/mrhuychien" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NGUYỄN HUY CHIẾN</span>
        <span>THINK IN SYSTEMS • BUILD IN PUBLIC</span>
        <a href="#top">LÊN ĐẦU TRANG ↑</a>
      </div>
    </footer>
  );
}
