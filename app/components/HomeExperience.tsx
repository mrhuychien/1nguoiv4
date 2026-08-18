"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { posts, toolsDirectory } from "../content";
import { SiteFooter } from "./GlobalChrome";

const navItems = [
  ["Câu chuyện", "#story"],
  ["Hành trình ERP", "#erp"],
  ["Dự án", "#work"],
  ["Bài viết", "/blog"],
  ["Công cụ", "/tools"],
];

const timeline = [
  { year: "01", title: "Nhìn thấy nút thắt", text: "Báo cáo đến muộn, dữ liệu nằm rải rác và rất nhiều việc phải nhớ bằng đầu." },
  { year: "02", title: "Chuẩn hóa quy trình", text: "Tách công việc thành trạng thái, trách nhiệm, dữ liệu đầu vào và điều kiện hoàn tất." },
  { year: "03", title: "Đưa ERP vào lõi", text: "ERPNext trở thành nơi kết nối bán hàng, kho, mua hàng, kế toán, sản xuất và nhân sự." },
  { year: "04", title: "Nối thêm automation", text: "n8n, API, BI và AI xử lý phần lặp lại để con người tập trung vào ngoại lệ và quyết định." },
];

const projects = [
  { code: "OPS/01", title: "ERPNext tại nhà máy", text: "Một lõi dữ liệu chung cho bán hàng, kho, kế toán, mua hàng, sản xuất và chấm công.", tag: "SYSTEM", className: "project-primary" },
  { code: "AI/02", title: "PO Reader", text: "Đọc đơn đặt hàng siêu thị, chuẩn hóa mã hàng và đưa dữ liệu vào ERP.", tag: "AI × ERP", className: "project-acid" },
  { code: "SAAS/03", title: "npp.sale", text: "Thử nghiệm một cách đặt hàng và quản trị nhà phân phối gọn hơn cho FMCG.", tag: "PRODUCT", className: "project-paper" },
  { code: "DATA/04", title: "Operations BI", text: "Biến dữ liệu bán hàng, tồn kho và công nợ thành tín hiệu có thể hành động.", tag: "DATA", className: "project-cyan" },
  { code: "LAB/05", title: "1nguoi.com", text: "Ghi lại cách một người dùng hệ thống, AI và tinh thần học liên tục để làm việc lớn hơn.", tag: "BUILD IN PUBLIC", className: "project-orange" },
];

function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: 0.72, y: 0.34 };
    const dots = Array.from({ length: reduceMotion ? 28 : 58 }, (_, index) => ({
      x: (index * 0.61803398875) % 1,
      y: (index * 0.41421356237) % 1,
      radius: 0.7 + (index % 4) * 0.4,
      speed: 0.00008 + (index % 7) * 0.000015,
      phase: index * 0.72,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const positions = dots.map((dot) => ({
        x: dot.x * width + Math.sin(time * dot.speed + dot.phase) * 18 + (pointer.x - 0.5) * 14,
        y: dot.y * height + Math.cos(time * dot.speed * 0.8 + dot.phase) * 16 + (pointer.y - 0.5) * 10,
        radius: dot.radius,
      }));

      for (let i = 0; i < positions.length; i += 1) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j += 1) {
          const b = positions[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 128) {
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(44, 96, 120, ${0.12 * (1 - distance / 128)})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
        context.beginPath();
        context.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(18, 61, 75, .28)";
        context.fill();
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    if (!reduceMotion) frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas className="ambient-field" ref={canvasRef} aria-hidden="true" />;
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="1 Người — Trang chủ">
        <span>1</span>
        <span>NGƯỜI</span>
      </Link>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Điều hướng chính">
        {navItems.map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <span className="live-note"><i /> Đang xây mỗi ngày</span>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function ScrollCue() {
  return (
    <a className="scroll-cue" href="#story" aria-label="Cuộn xuống đọc câu chuyện">
      <span>CUỘN ĐỂ KHÁM PHÁ</span>
      <i />
    </a>
  );
}

export default function HomeExperience() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const moveHero = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroRef.current?.style.setProperty("--rx", `${-y * 5}deg`);
    heroRef.current?.style.setProperty("--ry", `${x * 7}deg`);
    heroRef.current?.style.setProperty("--mx", `${x * 18}px`);
    heroRef.current?.style.setProperty("--my", `${y * 14}px`);
  };

  return (
    <main className="site-shell">
      <AmbientField />
      <SiteHeader />

      <section className="hero" onPointerMove={moveHero}>
        <div className="hero-circuit" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="hero-ghost-type" aria-hidden="true">ONE</div>
        <div className="hero-copy">
          <p className="eyebrow"><span>Human operating system / 2026</span> Nguyễn Huy Chiến</p>
          <h1>
            MỘT NGƯỜI.
            <span>NHIỀU VAI.</span>
            <em>MỘT HỆ THỐNG.</em>
          </h1>
          <p className="hero-lead">
            Tôi xây hệ thống để công việc bớt phụ thuộc vào trí nhớ — và dùng công nghệ để một người có thể tạo ra nhiều giá trị hơn.
          </p>
          <div className="hero-cta-row">
            <a className="primary-button" href="#erp">
              <span>Xem hành trình ERP</span>
              <b aria-hidden="true">↗</b>
            </a>
            <Link className="text-link" href="/blog">Đọc những điều tôi học được <span>→</span></Link>
          </div>
        </div>

        <div className="hero-visual" ref={heroRef}>
          <div className="hero-stage" aria-hidden="true">
            <span>1</span>
            <i>ERP / AI / OPS</i>
            <b>01</b>
          </div>
          <div className="hero-depth-grid" aria-hidden="true" />
          <div className="hero-scanline" aria-hidden="true" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="image-aura" />
          <img
            className="hero-character"
            src="/characters/multitask.webp"
            alt="Nguyễn Huy Chiến trong hình tượng một người đảm nhiệm nhiều vai trò"
            width={1024}
            height={1536}
          />
          <div className="floating-card card-erp">
            <span>01 / SYSTEM</span>
            <strong>ERP BUILDER</strong>
            <small>QUY TRÌNH → DỮ LIỆU → HÀNH ĐỘNG</small>
          </div>
          <div className="floating-card card-maker">
            <span>02 / MAKER</span>
            <strong>AI × AUTOMATION</strong>
            <small>MAKE IT WORK. THEN MAKE IT BETTER.</small>
          </div>
          <div className="floating-card card-life">
            <span>03 / LIFE</span>
            <strong>CHA • CHỒNG • NGƯỜI HỌC</strong>
          </div>
          <div className="signal-pill"><i /> SIGNAL ONLINE</div>
        </div>

        <div className="hero-system-rail" aria-hidden="true">
          <span>ERP BUILDER</span><i />
          <span>OPERATIONS THINKER</span><i />
          <span>AI MAKER</span><i />
          <span>FATHER</span><i />
          <b>ONE PERSON / MANY SYSTEMS</b>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>HẢI PHÒNG</span>
          <b>20°51′N</b>
          <span>106°41′E</span>
        </div>
        <ScrollCue />
      </section>

      <section className="opening-statement" id="story">
        <p className="section-code">00 — LỜI MỞ ĐẦU</p>
        <div className="statement-grid">
          <h2>Tôi không bắt đầu từ công nghệ.</h2>
          <div>
            <p>Tôi bắt đầu từ những việc bị lặp lại, những báo cáo đến muộn và những quyết định thiếu dữ liệu.</p>
            <p>Rồi tôi học cách biến từng nút thắt thành quy trình, từng quy trình thành hệ thống, và từng hệ thống thành một cách làm việc nhẹ hơn.</p>
          </div>
        </div>
        <div className="statement-marquee" aria-hidden="true">
          <span>VẬN HÀNH • ERP • AI • TỰ ĐỘNG HÓA • DỮ LIỆU • CON NGƯỜI • </span>
          <span>VẬN HÀNH • ERP • AI • TỰ ĐỘNG HÓA • DỮ LIỆU • CON NGƯỜI • </span>
        </div>
      </section>

      <section className="role-chapters">
        <div className="section-heading" data-reveal>
          <p className="section-code dark-code">01 — MỘT NGƯỜI, NHIỀU VAI</p>
          <h2>Không cân bằng.<br /><em>Chỉ là cùng một cuộc sống.</em></h2>
          <p>Công việc, công nghệ và gia đình không nằm ở ba thế giới khác nhau. Chúng cùng dạy tôi cách quan sát, chăm chút và xây những thứ có ích.</p>
        </div>

        <div className="role-grid">
          <article className="role-card role-card-wide" data-reveal>
            <div className="role-copy">
              <span>01 / SYSTEM BUILDER</span>
              <h3>Ngồi giữa dữ liệu<br />và vận hành.</h3>
              <p>Ba màn hình không làm công việc thông minh hơn. Một câu hỏi đúng và một luồng dữ liệu rõ ràng thì có.</p>
              <a href="#erp">Xem hành trình ERP <b>↗</b></a>
            </div>
            <div className="role-image role-image-tech">
              <img src="/characters/erp-builder.webp" alt="Nguyễn Huy Chiến làm việc với ba màn hình dữ liệu" width="900" height="1350" loading="lazy" />
              <i className="role-scan" />
            </div>
          </article>

          <article className="role-card role-card-tall" data-reveal>
            <div className="role-copy">
              <span>02 / FATHER</span>
              <h3>Có những việc không thể tự động hóa.</h3>
              <p>Thời gian dành cho con là một lời nhắc rất thật: công nghệ phải trả lại thời gian cho con người.</p>
            </div>
            <div className="role-image role-image-life">
              <img src="/characters/father.webp" alt="Khoảnh khắc chăm sóc con trong gia đình" width="900" height="1350" loading="lazy" />
            </div>
          </article>

          <article className="role-card role-card-small" data-reveal>
            <div className="role-image role-image-kitchen">
              <img src="/characters/kitchen.webp" alt="Một khoảnh khắc đời thường trong bếp" width="900" height="1350" loading="lazy" />
            </div>
            <div className="role-copy">
              <span>03 / EVERYDAY MAKER</span>
              <h3>Làm, quan sát, rồi làm tốt hơn.</h3>
            </div>
          </article>
        </div>
      </section>

      <section className="erp-journey" id="erp">
        <div className="erp-grid-bg" aria-hidden="true" />
        <div className="erp-intro" data-reveal>
          <p className="section-code">02 — HÀNH TRÌNH ERP</p>
          <h2>ERP không bắt đầu bằng phần mềm.</h2>
          <p>Nó bắt đầu bằng việc nhìn thẳng vào cách doanh nghiệp đang vận hành — cả phần trơn tru lẫn những chỗ mọi người đã quen với sự bất tiện.</p>
        </div>

        <div className="erp-terminal" data-reveal>
          <div className="terminal-top"><span>OPERATING_SYSTEM.LOG</span><i /><i /><i /></div>
          <div className="terminal-map">
            <div className="terminal-core"><span>ERP</span><small>SOURCE OF TRUTH</small></div>
            <div className="terminal-node node-sales">BÁN HÀNG</div>
            <div className="terminal-node node-stock">KHO</div>
            <div className="terminal-node node-account">KẾ TOÁN</div>
            <div className="terminal-node node-factory">SẢN XUẤT</div>
            <div className="terminal-node node-people">NHÂN SỰ</div>
            <svg viewBox="0 0 600 360" aria-hidden="true">
              <path d="M300 180 L120 80 M300 180 L480 70 M300 180 L520 238 M300 180 L300 320 M300 180 L80 250" />
            </svg>
            <div className="data-pulse pulse-one" /><div className="data-pulse pulse-two" /><div className="data-pulse pulse-three" />
          </div>
          <div className="terminal-status"><span><i /> DATA FLOW ACTIVE</span><span>API: 200 OK</span><span>AUTOMATION: READY</span></div>
        </div>

        <div className="journey-list">
          {timeline.map((item) => (
            <article key={item.year} data-reveal>
              <span>{item.year}</span>
              <div><small>PHASE {item.year}</small><h3>{item.title}</h3><p>{item.text}</p></div>
              <b>↗</b>
            </article>
          ))}
        </div>

        <blockquote data-reveal>
          <span>“</span>
          <p>Tôi không theo đuổi một hệ thống hoàn hảo. Tôi theo đuổi một hệ thống có thể thay đổi cùng doanh nghiệp.</p>
        </blockquote>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading work-heading" data-reveal>
          <p className="section-code dark-code">03 — NHỮNG THỨ ĐANG XÂY</p>
          <h2>Không chỉ là ý tưởng.<br /><em>Là những thứ đang chạy.</em></h2>
          <p>Mỗi dự án là một cách trả lời cho một nút thắt vận hành cụ thể.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card ${project.className}`} key={project.code} data-reveal>
              <div className="project-top"><span>{project.code}</span><i>{project.tag}</i></div>
              <div className="project-index">0{index + 1}</div>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
              <span className="project-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="one-person-manifesto">
        <div className="manifesto-sphere" aria-hidden="true"><span>1</span><i /><i /><i /></div>
        <div className="manifesto-copy" data-reveal>
          <p className="section-code">04 — 1NGUOI.COM</p>
          <h2>Một người<br />không có nghĩa<br />là <em>một mình.</em></h2>
          <p>Đó là một cách làm việc: dùng nền tảng mở, AI, tự động hóa và cộng đồng để khuếch đại năng lực cá nhân.</p>
          <div className="manifesto-values"><span>01. HỌC CÔNG KHAI</span><span>02. XÂY THỨ HỮU ÍCH</span><span>03. CHIA SẺ CÁCH LÀM</span></div>
        </div>
      </section>

      <section className="journal-section" id="journal">
        <div className="journal-head" data-reveal>
          <div><p className="section-code dark-code">05 — NHẬT KÝ XÂY HỆ THỐNG</p><h2>Ghi lại để<br />nghĩ rõ hơn.</h2></div>
          <Link className="circle-link" href="/blog"><span>XEM TẤT CẢ</span><b>↗</b></Link>
        </div>
        <div className="post-list">
          {posts.slice(0, 3).map((post) => (
            <Link className={`post-row accent-${post.accent}`} href={`/blog/${post.slug}`} key={post.slug} data-reveal>
              <span className="post-number">{post.number}</span>
              <div className="post-row-main"><div><span>{post.category}</span><i>{post.date}</i></div><h3>{post.title}</h3><p>{post.excerpt}</p></div>
              <span className="post-go">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="tools-preview">
        <div className="tools-preview-head" data-reveal>
          <p className="section-code">06 — TOOLBOX</p>
          <h2>Không chỉ kể.<br />Còn có thứ để dùng.</h2>
          <Link href="/tools">MỞ KHO CÔNG CỤ <span>↗</span></Link>
        </div>
        <div className="tools-strip">
          {toolsDirectory.slice(0, 3).map((tool) => (
            <Link className={`tool-mini accent-${tool.accent}`} href={tool.status === "Dùng ngay" ? `/tools/${tool.slug}` : "/tools"} key={tool.slug} data-reveal>
              <span className="tool-symbol">{tool.symbol}</span>
              <i>{tool.category}</i>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <b>{tool.status} ↗</b>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
