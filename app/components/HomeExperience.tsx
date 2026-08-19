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

function Hero() {
  return (
    <section className="nv-hero" id="top">
      <div className="nv-hero-grid" aria-hidden="true" />
      <div className="nv-hero-copy">
        <div className="nv-eyebrow"><span>NGUYỄN HUY CHIẾN</span><i />HẢI PHÒNG / VIỆT NAM</div>
        <h1><span>MỘT NGƯỜI.</span><span>NHIỀU HỆ</span><span>ĐANG <em>CHẠY.</em></span></h1>
        <div className="nv-hero-intro">
          <b>01 / A LIVING PORTFOLIO</b>
          <p>Tôi xây hệ thống để công việc bớt phụ thuộc vào trí nhớ — và để một người có thể tạo ra nhiều giá trị hơn.</p>
        </div>
      </div>
      <div className="nv-hero-stage">
        <div className="nv-stage-orbit orbit-a" /><div className="nv-stage-orbit orbit-b" />
        <VideoShell src="/motion/multitask.mp4" eager />
        <span className="nv-float-tag tag-a">ERP / OPS</span>
        <span className="nv-float-tag tag-b">AI / DATA</span>
        <span className="nv-float-tag tag-c">HUMAN / CORE</span>
      </div>
      <div className="nv-hero-bottom"><span>KÉO ĐỂ ĐI VÀO HỆ THỐNG</span><i><b /></i><span>ISO / 45° &nbsp; MOTION / ON</span></div>
    </section>
  );
}

function WorldJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let smooth = 0;
    let current = -1;

    const tick = () => {
      const travel = Math.max(1, root.offsetHeight - innerHeight);
      const target = Math.min(1, Math.max(0, (scrollY - root.offsetTop) / travel));
      smooth += (target - smooth) * (reduceMotion ? 1 : 0.105);
      const scene = Math.min(worlds.length - 1, Math.max(0, Math.round(smooth * (worlds.length - 1))));
      root.style.setProperty("--journey", String(smooth));
      root.style.setProperty("--world-color", worlds[scene].color);
      worlds.forEach((_, index) => {
        const center = index / (worlds.length - 1);
        const alpha = Math.max(0, 1 - Math.abs(smooth - center) * 4.1);
        const shell = videoRefs.current[index]?.parentElement?.parentElement;
        shell?.style.setProperty("--scene-alpha", String(alpha));
        shell?.style.setProperty("--scene-scale", String(0.9 + alpha * 0.1));
      });
      if (scene !== current) {
        current = scene;
        setActive(scene);
        videoRefs.current.forEach((video, index) => {
          if (!video || reduceMotion) return;
          if (index === scene) void video.play().catch(() => undefined);
          else video.pause();
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="nv-world-journey" id="worlds" ref={rootRef}>
      <div className="nv-world-sticky">
        <div className="nv-world-rail" aria-hidden="true"><span>00</span><i><b style={{ height: `${((active + 1) / worlds.length) * 100}%` }} /></i><span>04</span></div>
        <div className="nv-world-copy">
          <p className="nv-section-code">02 — FOUR WORLDS / ONE PERSON</p>
          {worlds.map((world, index) => (
            <article className={active === index ? "is-active" : ""} key={world.no}>
              <div><span>{world.no} / 04</span><i>{world.kicker}</i></div>
              <h2>{world.title}</h2>
              <p>{world.body}</p>
              <ul>{world.meta.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="nv-world-stage">
          <div className="nv-world-floor" aria-hidden="true" />
          {worlds.map((world, index) => (
            <VideoShell
              key={world.no}
              src={world.video}
              videoRef={(node) => { videoRefs.current[index] = node; }}
            />
          ))}
          <div className="nv-world-hud"><span>SCENE / {worlds[active].no}</span><span>DEPTH / 45°</span><span>MOTION / LIVE</span></div>
        </div>
      </div>
    </section>
  );
}

function Principle() {
  return (
    <section className="nv-principle">
      <p className="nv-section-code">03 — THE PRINCIPLE</p>
      <div className="nv-principle-title"><span>KHÔNG XÂY</span><span>PHẦN MỀM.</span><span>XÂY KHẢ NĂNG</span><span><em>THAY ĐỔI.</em></span></div>
      <div className="nv-principle-note"><b>MANIFESTO / 001</b><p>Mỗi hệ thống bắt đầu từ một điểm ma sát thật. Mỗi công cụ phải dẫn tới một hành vi tốt hơn. Mỗi bài viết là một lần kiểm nghiệm lại điều mình tưởng đã hiểu.</p></div>
      <div className="nv-data-cube" aria-hidden="true"><i /><i /><i /><b>1</b><span>HUMAN<br />OS</span></div>
    </section>
  );
}

function Flow() {
  return (
    <section className="nv-flow" id="flow">
      <header><p className="nv-section-code">04 — ERP JOURNEY / OPERATING FLOW</p><h2>TỪ MA SÁT<br />TỚI <em>DÒNG CHẢY.</em></h2><p>Một quy trình đủ tốt phải nhìn được, đo được và tiếp tục thay đổi được.</p></header>
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
      <header><p className="nv-section-code">05 — OPEN TOOLBOX</p><h2>KHÔNG CHỈ VIẾT.<br /><em>XÂY THỨ DÙNG ĐƯỢC.</em></h2><Link href="/tools">MỞ TOÀN BỘ CÔNG CỤ ↗</Link></header>
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
      <header><p className="nv-section-code">06 — FIELD NOTES / E-MAGAZINE</p><h2>NHỮNG ĐIỀU<br />ĐÃ QUA <em>THỰC TẾ.</em></h2><Link href="/blog">ĐỌC TOÀN BỘ TẠP CHÍ ↗</Link></header>
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
      <p>07 — ONE PERSON / MANY SYSTEMS</p>
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

  return <main className="nv-site" ref={rootRef}><Header /><Hero /><WorldJourney /><Principle /><Flow /><Toolbox /><Journal /><Finale /></main>;
}
