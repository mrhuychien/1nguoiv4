"use client";

/* eslint-disable @next/next/no-img-element -- local editorial art is intentionally rendered as a raw magazine layer. */

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { posts, toolsDirectory } from "../content";

const worlds = [
  {
    no: "01",
    kicker: "THE OPERATOR",
    title: "Một người. Nhiều vai. Một nhịp vận hành.",
    body: "Công việc của tôi nằm giữa dữ liệu, con người, hàng hóa và những ngoại lệ không bao giờ có trong slide.",
    video: "/motion/multitask.mp4",
    color: "#c8ff45",
    meta: ["OPERATIONS", "DECISION", "SYSTEM THINKING"],
  },
  {
    no: "02",
    kicker: "THE ERP BUILDER",
    title: "Biến những mảnh rời thành một hệ thống sống.",
    body: "ERPNext nối bán hàng, kho, mua hàng, kế toán và sản xuất thành một dòng dữ liệu có thể nhìn thấy, đo lường và tiếp tục thay đổi.",
    video: "/motion/erp.mp4",
    color: "#62e8d5",
    meta: ["ERPNEXT", "FRAPPE", "MANUFACTURING"],
  },
  {
    no: "03",
    kicker: "THE EVERYDAY LAB",
    title: "Công nghệ tốt phải trả lại thời gian sống.",
    body: "Sau màn hình vẫn là một người nấu cơm, học tiếp và chăm sóc gia đình. Hệ thống chỉ có ý nghĩa khi đời sống trở nên nhẹ hơn.",
    video: "/motion/kitchen.mp4",
    color: "#ff8054",
    meta: ["FAMILY", "LEARNING", "BALANCE"],
  },
  {
    no: "04",
    kicker: "THE HUMAN CORE",
    title: "Kiên nhẫn cũng là một năng lực thiết kế.",
    body: "Quan sát, hiện diện và cải tiến mỗi ngày — những bài học quan trọng đôi khi đến từ gia đình, không phải phòng họp.",
    video: "/motion/father.mp4",
    color: "#9b8cff",
    meta: ["CARE", "PATIENCE", "GROWTH"],
  },
];

const flow = [
  ["01", "NHÌN", "Tìm đúng ma sát trước khi nói về phần mềm."],
  ["02", "MÔ HÌNH", "Tách đầu vào, trạng thái và trách nhiệm."],
  ["03", "KẾT NỐI", "Đưa dữ liệu lõi về một nguồn sự thật."],
  ["04", "TỰ ĐỘNG", "Cho máy xử lý phần lặp lại có kiểm soát."],
  ["05", "ĐO LƯỜNG", "Biến dữ liệu thành tín hiệu cải tiến."],
];

type VideoShellProps = {
  src: string;
  eager?: boolean;
  videoRef?: (node: HTMLVideoElement | null) => void;
};

function VideoShell({ src, eager = false, videoRef }: VideoShellProps) {
  return (
    <div className="nv-video-shell">
      <div className="nv-video-bezel">
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          autoPlay={eager}
          preload={eager ? "auto" : "metadata"}
          aria-hidden="true"
        />
        <span className="nv-video-scan" />
      </div>
      <div className="nv-video-base" />
      <div className="nv-video-shadow" />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nv-header">
      <Link className="nv-brand" href="/" aria-label="1 Người — Trang chủ">
        <b>1</b><span>NGƯỜI</span><i>/ HUMAN OS</i>
      </Link>
      <nav className={open ? "nv-nav is-open" : "nv-nav"} aria-label="Điều hướng chính">
        <a href="#worlds" onClick={() => setOpen(false)}>Thế giới</a>
        <a href="#flow" onClick={() => setOpen(false)}>Hành trình ERP</a>
        <Link href="/blog" onClick={() => setOpen(false)}>Bài viết</Link>
        <Link href="/tools" onClick={() => setOpen(false)}>Công cụ</Link>
      </nav>
      <div className="nv-live"><i /> LIVE SYSTEM / 2026</div>
      <button className="nv-menu" type="button" aria-label="Mở menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><i /><i /></button>
    </header>
  );
}

function SceneHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let scheduled = false;

    const update = () => {
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - root.offsetTop) / travel));
      const scene = Math.min(worlds.length - 1, Math.max(0, Math.round(progress * (worlds.length - 1))));
      root.style.setProperty("--hero-progress", String(progress));
      root.style.setProperty("--scene-color", worlds[scene].color);
      if (scene !== activeRef.current) {
        activeRef.current = scene;
        setActive(scene);
      }
      scheduled = false;
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && !reduceMotion) void video.play().catch(() => undefined);
      else video.pause();
    });
  }, [active]);

  const goToScene = (index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const travel = Math.max(1, root.offsetHeight - window.innerHeight);
    const top = root.offsetTop + (index / (worlds.length - 1)) * travel;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section className="nv-scene-hero" id="worlds" ref={rootRef} style={{ "--scene-color": worlds[active].color } as CSSProperties}>
      <div className="nv-scene-sticky">
        <div className="nv-scene-backdrop" aria-hidden="true"><i /><i /><i /></div>
        <div className="nv-scene-layout">
          <div className="nv-scene-copy">
            <div className="nv-scene-eyebrow"><span>NGUYỄN HUY CHIẾN</span><i />HẢI PHÒNG / VIỆT NAM</div>
            <p className="nv-scene-overline">MỘT NGƯỜI / BỐN THẾ GIỚI ĐANG CHẠY</p>
            <div className="nv-scene-copy-stack">
              {worlds.map((world, index) => (
                <article
                  className={index === active ? "is-active" : index < active ? "is-before" : "is-after"}
                  aria-hidden={index !== active}
                  key={world.no}
                >
                  <div><span>{world.no} / 04</span><i>{world.kicker}</i></div>
                  <h1>{world.title}</h1>
                  <p>{world.body}</p>
                  <ul>{world.meta.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>

          <div className="nv-scene-stage">
            <div className="nv-scene-orbit" aria-hidden="true"><i /><i /></div>
            <div className="nv-scene-deck">
              {worlds.map((world, index) => (
                <div
                  className={`nv-scene-panel ${index === active ? "is-active" : index < active ? "is-before" : "is-after"}`}
                  aria-hidden={index !== active}
                  key={world.no}
                >
                  <VideoShell
                    src={world.video}
                    eager={index === 0}
                    videoRef={(node) => { videoRefs.current[index] = node; }}
                  />
                  <span className="nv-scene-caption">SCENE {world.no} / LIVE MOTION</span>
                </div>
              ))}
            </div>
            <strong className="nv-scene-ghost" aria-hidden="true">{worlds[active].no}</strong>
          </div>
        </div>

        <div className="nv-scene-controls" aria-label="Chọn cảnh mở đầu">
          {worlds.map((world, index) => (
            <button
              className={index === active ? "is-active" : ""}
              type="button"
              aria-label={`Mở cảnh ${world.no}: ${world.title}`}
              aria-current={index === active ? "step" : undefined}
              onClick={() => goToScene(index)}
              key={world.no}
            >
              <span>{world.no}</span><b>{world.kicker.replace("THE ", "")}</b><i />
            </button>
          ))}
        </div>
        <div className="nv-scene-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / worlds.length) * 100}%` }} /></div>
        <div className="nv-scene-scroll"><span>KÉO ĐỂ CHUYỂN CẢNH</span><i>↓</i></div>
      </div>
    </section>
  );
}

function Principle() {
  return (
    <section className="nv-principle">
      <p className="nv-section-code">02 — THE PRINCIPLE</p>
      <div className="nv-principle-title"><span>KHÔNG XÂY</span><span>PHẦN MỀM.</span><span>XÂY KHẢ NĂNG</span><span><em>THAY ĐỔI.</em></span></div>
      <div className="nv-principle-note"><b>MANIFESTO / 001</b><p>Mỗi hệ thống bắt đầu từ một điểm ma sát thật. Mỗi công cụ phải dẫn tới một hành vi tốt hơn. Mỗi bài viết là một lần kiểm nghiệm lại điều mình tưởng đã hiểu.</p></div>
      <div className="nv-data-cube" aria-hidden="true"><i /><i /><i /><b>1</b><span>HUMAN<br />OS</span></div>
    </section>
  );
}

function Flow() {
  return (
    <section className="nv-flow" id="flow">
      <header><p className="nv-section-code">03 — ERP JOURNEY / OPERATING FLOW</p><h2>TỪ MA SÁT<br />TỚI <em>DÒNG CHẢY.</em></h2><p>Một quy trình đủ tốt phải nhìn được, đo được và tiếp tục thay đổi được.</p></header>
      <div className="nv-flow-line" aria-hidden="true"><i /></div>
      <div className="nv-flow-steps">
        {flow.map((step, index) => <article key={step[0]} style={{ "--step": index } as CSSProperties}><span>{step[0]}</span><b>{step[1]}</b><p>{step[2]}</p><i>↘</i></article>)}
      </div>
    </section>
  );
}

function Toolbox() {
  return (
    <section className="nv-toolbox">
      <header><p className="nv-section-code">04 — OPEN TOOLBOX</p><h2>KHÔNG CHỈ VIẾT.<br /><em>XÂY THỨ DÙNG ĐƯỢC.</em></h2><Link href="/tools">MỞ TOÀN BỘ CÔNG CỤ ↗</Link></header>
      <div className="nv-tool-grid">
        {toolsDirectory.map((tool, index) => {
          const content = <><div><span>0{index + 1}</span><i>{tool.symbol}</i></div><small>{tool.category}</small><h3>{tool.title}</h3><p>{tool.description}</p><b>{tool.status} ↗</b></>;
          return tool.status === "Dùng ngay" ? <Link href={`/tools/${tool.slug}`} key={tool.slug}>{content}</Link> : <article key={tool.slug}>{content}</article>;
        })}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="nv-journal">
      <header><p className="nv-section-code">05 — FIELD NOTES / E-MAGAZINE</p><h2>NHỮNG ĐIỀU<br />ĐÃ QUA <em>THỰC TẾ.</em></h2><Link href="/blog">ĐỌC TOÀN BỘ TẠP CHÍ ↗</Link></header>
      <div className="nv-issues">
        {posts.slice(0, 3).map((post, index) => (
          <Link className={`nv-issue issue-${index + 1}`} href={`/blog/${post.slug}`} key={post.slug}>
            <div className="nv-issue-cover">
              <div><b>1 NGƯỜI</b><span>ISSUE {post.number}</span></div>
              <small>{post.category}</small><h3>{post.title}</h3>
              <img src={post.coverImage} alt="" width={1024} height={1536} loading="lazy" />
              <strong>{post.metric}</strong><p>{post.excerpt}</p>
              <footer><span>{post.readTime}</span><b>MỞ ISSUE ↗</b></footer>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Finale() {
  return (
    <footer className="nv-finale">
      <div className="nv-finale-grid" aria-hidden="true" />
      <p>06 — ONE PERSON / MANY SYSTEMS</p>
      <h2>THINK IN<br /><span>SYSTEMS.</span><br />BUILD IN <em>PUBLIC.</em></h2>
      <div><p>Tôi tiếp tục học, xây và ghi lại những thứ giúp một người làm việc lớn hơn mà không phải tự làm mọi thứ.</p><Link href="/blog">BẮT ĐẦU TỪ MỘT BÀI VIẾT <span>↗</span></Link></div>
      <small>© 2026 NGUYỄN HUY CHIẾN &nbsp; / &nbsp; HẢI PHÒNG, VIỆT NAM &nbsp; / &nbsp; 1NGUOI.COM</small>
    </footer>
  );
}

export default function HomeExperience() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (event: PointerEvent) => { pointer.tx = event.clientX / innerWidth - 0.5; pointer.ty = event.clientY / innerHeight - 0.5; };
    const tick = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      root.style.setProperty("--mx", String(pointer.x));
      root.style.setProperty("--my", String(pointer.y));
      root.style.setProperty("--page", String(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
      frame = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { removeEventListener("pointermove", onPointer); cancelAnimationFrame(frame); };
  }, []);

  return <main className="nv-site" ref={rootRef}><Header /><SceneHero /><Principle /><Flow /><Toolbox /><Journal /><Finale /></main>;
}
