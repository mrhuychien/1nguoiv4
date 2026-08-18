"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { posts } from "../content";

const roles = [
  {
    no: "01",
    label: "OPERATIONS",
    title: "Người vận hành",
    text: "Tôi đứng ở nơi mọi thứ va vào nhau: con người, hàng hóa, tiến độ, chi phí và những ngoại lệ không nằm trong quy trình.",
    image: "/characters/multitask.webp",
    tone: "volt",
  },
  {
    no: "02",
    label: "SYSTEM",
    title: "Người xây ERP",
    text: "Tôi biến các nút thắt thành dữ liệu, biến dữ liệu thành luồng công việc, rồi để hệ thống giữ nhịp cho cả tổ chức.",
    image: "/characters/erp-builder.webp",
    tone: "cyan",
  },
  {
    no: "03",
    label: "EVERYDAY",
    title: "Một người bình thường",
    text: "Sau màn hình vẫn là một người nấu cơm, chăm con, đọc sách và học tiếp. Công nghệ có ý nghĩa khi trả lại thời gian cho đời sống.",
    image: "/characters/kitchen.webp",
    tone: "ember",
  },
  {
    no: "04",
    label: "FATHER",
    title: "Người cha",
    text: "Kiên nhẫn, quan sát và có mặt. Những bài học quan trọng nhất về thiết kế hệ thống đôi khi không đến từ phòng họp.",
    image: "/characters/father.webp",
    tone: "ice",
  },
];

const erpSteps = [
  {
    no: "01",
    kicker: "THE FRICTION",
    title: "Nhìn thấy\nđiểm nghẽn.",
    text: "Báo cáo đến muộn. Dữ liệu nằm rải rác. Mỗi người giữ một phiên bản sự thật và quá nhiều việc phụ thuộc vào trí nhớ.",
    metric: "1×",
    metricText: "sự thật vận hành",
  },
  {
    no: "02",
    kicker: "THE MODEL",
    title: "Đặt lại\ntrật tự.",
    text: "Tách mỗi công việc thành đầu vào, người chịu trách nhiệm, trạng thái, điều kiện hoàn tất và dữ liệu cần để ra quyết định.",
    metric: "06",
    metricText: "phân hệ lõi",
  },
  {
    no: "03",
    kicker: "THE CORE",
    title: "Đưa ERP\nvào trung tâm.",
    text: "Bán hàng, kho, mua hàng, kế toán, sản xuất và nhân sự cùng chạy trên một nhịp dữ liệu thay vì sáu hòn đảo riêng biệt.",
    metric: "360°",
    metricText: "dòng chảy dữ liệu",
  },
  {
    no: "04",
    kicker: "THE LEVERAGE",
    title: "Nối thêm\ntrí tuệ.",
    text: "API, n8n, BI và AI xử lý phần lặp lại. Con người chuyển từ nhập liệu sang giải quyết ngoại lệ và đưa ra quyết định.",
    metric: "∞",
    metricText: "khả năng mở rộng",
  },
];

const projects = [
  ["ERP CORE", "Nhà máy vận hành trên một lõi dữ liệu", "ERPNext / Frappe", "01"],
  ["PO READER", "Biến đơn đặt hàng thành dữ liệu có cấu trúc", "AI / AUTOMATION", "02"],
  ["NPP.SALE", "Cách đặt hàng gọn hơn cho nhà phân phối", "PRODUCT / FMCG", "03"],
  ["OPS BI", "Tín hiệu hành động từ doanh số và tồn kho", "DATA / DECISION", "04"],
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function chapterOpacity(progress: number, index: number, count: number) {
  const center = index / (count - 1);
  const distance = Math.abs(progress - center);
  return clamp(1 - distance * (count - 1) * 1.45);
}

function useScrollScene() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--page-p", String(clamp(window.scrollY / max)));

      document.querySelectorAll<HTMLElement>("[data-scroll-scene]").forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = reduced ? 0 : clamp(-rect.top / travel);
        scene.style.setProperty("--p", String(progress));
        scene.style.setProperty("--enter", String(clamp(progress * 4)));
        scene.style.setProperty("--leave", String(clamp((progress - 0.72) * 4.2)));

        const count = Number(scene.dataset.steps || 0);
        for (let index = 0; index < count; index += 1) {
          scene.style.setProperty(`--step-${index}`, String(chapterOpacity(progress, index, count)));
        }
      });

      document.querySelectorAll<HTMLElement>("[data-rise]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const visible = clamp((window.innerHeight - rect.top) / Math.min(window.innerHeight * 0.55, 520));
        node.style.setProperty("--visible", String(visible));
      });
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);
}

function PointerGlow() {
  useEffect(() => {
    const root = document.documentElement;
    const move = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div className="os-pointer-glow" aria-hidden="true" />;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="os-header">
      <Link href="/" className="os-logo" aria-label="1 Người — Trang chủ">
        <span>1</span><b>NGƯỜI</b><i>®</i>
      </Link>
      <nav className={open ? "os-nav is-open" : "os-nav"} aria-label="Điều hướng chính">
        <a href="#identity" onClick={() => setOpen(false)}>Câu chuyện</a>
        <a href="#system" onClick={() => setOpen(false)}>Hành trình ERP</a>
        <a href="#work" onClick={() => setOpen(false)}>Công việc</a>
        <Link href="/blog" onClick={() => setOpen(false)}>Tạp chí</Link>
        <Link href="/tools" onClick={() => setOpen(false)}>Công cụ</Link>
      </nav>
      <div className="os-header-meta"><i /><span>BUILDING IN PUBLIC</span></div>
      <button className="os-menu" type="button" aria-label="Mở menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /><span />
      </button>
    </header>
  );
}

function ScrollProgress() {
  return (
    <aside className="os-progress" aria-hidden="true">
      <span>00</span><div><i /></div><span>100</span>
    </aside>
  );
}

function Portal() {
  return (
    <section className="os-portal" data-scroll-scene id="identity">
      <div className="os-portal-sticky">
        <div className="os-space" aria-hidden="true"><i /><i /><i /></div>
        <div className="os-portal-number" aria-hidden="true">1</div>
        <div className="os-coordinates" aria-hidden="true"><span>20°51′N / 106°41′E</span><b>HAI PHONG — VN</b></div>

        <div className="os-portal-copy">
          <p><span>HUMAN OPERATING SYSTEM</span> / NGUYỄN HUY CHIẾN</p>
          <h1>
            <span>MỘT</span>
            <span>NGƯỜI</span>
            <em>NHIỀU HỆ THỐNG.</em>
          </h1>
          <div className="os-portal-intro">
            <b>01 — TUYÊN NGÔN</b>
            <p>Tôi dùng công nghệ để công việc bớt phụ thuộc vào trí nhớ — và để một người có thể tạo ra nhiều giá trị hơn.</p>
          </div>
        </div>

        <div className="os-avatar-rig" aria-hidden="true">
          <div className="os-ring ring-a"><i /><i /><i /><i /></div>
          <div className="os-ring ring-b" />
          <div className="os-avatar-aura" />
          <img src="/characters/multitask.webp" alt="" width={1024} height={1536} />
          <div className="os-tag tag-one"><i>01</i><span>ERP BUILDER</span></div>
          <div className="os-tag tag-two"><i>02</i><span>OPS THINKER</span></div>
          <div className="os-tag tag-three"><i>03</i><span>FATHER / MAKER</span></div>
        </div>

        <div className="os-scroll-command"><span>SCROLL TO ENTER</span><i><b /></i></div>
        <div className="os-portal-exit" aria-hidden="true">
          <span>KHÔNG PHẢI SIÊU NHÂN.</span>
          <strong>CHỈ LÀ MỘT NGƯỜI<br />BIẾT DÙNG ĐÒN BẨY.</strong>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="os-manifesto" data-rise>
      <div className="os-section-index"><span>01</span><b>WHY I BUILD</b></div>
      <p className="os-manifesto-kicker">MỘT CÂU CHUYỆN KHÔNG BẮT ĐẦU TỪ CODE</p>
      <h2>
        Tôi không bắt đầu<br />từ <span>công nghệ.</span>
      </h2>
      <div className="os-manifesto-bottom">
        <p>Tôi bắt đầu từ những việc bị lặp lại, những báo cáo đến muộn và những quyết định phải đưa ra khi chưa có đủ dữ liệu.</p>
        <p>Rồi tôi học cách biến từng nút thắt thành quy trình. Từng quy trình thành hệ thống. Và từng hệ thống thành một cách làm việc nhẹ hơn.</p>
      </div>
      <div className="os-manifesto-orbit" aria-hidden="true"><span>OBSERVE</span><span>SYSTEMIZE</span><span>AUTOMATE</span></div>
    </section>
  );
}

function RoleCorridor() {
  return (
    <section className="os-roles" data-scroll-scene id="roles">
      <div className="os-roles-sticky">
        <div className="os-corridor-head">
          <div className="os-section-index"><span>02</span><b>MULTIPLE ROLES</b></div>
          <h2>Một đời sống.<br /><em>Nhiều vai trò.</em></h2>
          <p>KÉO DỌC — DI CHUYỂN NGANG</p>
        </div>
        <div className="os-role-track">
          {roles.map((role) => (
            <article className={`os-role-card ${role.tone}`} key={role.no}>
              <div className="os-role-grid" aria-hidden="true" />
              <div className="os-role-meta"><span>{role.no}</span><b>{role.label}</b></div>
              <div className="os-role-copy">
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </div>
              <div className="os-role-image"><span aria-hidden="true">{role.no}</span><img src={role.image} alt="" width={1024} height={1536} /></div>
            </article>
          ))}
          <article className="os-role-card os-role-end">
            <p>Tất cả những vai này<br />dùng chung một thứ:</p>
            <h3>TƯ DUY<br />HỆ THỐNG.</h3>
            <a href="#system">ĐI TIẾP VÀO LÕI <span>↓</span></a>
          </article>
        </div>
      </div>
    </section>
  );
}

function SystemCore() {
  return (
    <section className="os-system" data-scroll-scene data-steps={erpSteps.length} id="system">
      <div className="os-system-sticky">
        <div className="os-system-stage" aria-hidden="true">
          <div className="os-core-halo halo-a" />
          <div className="os-core-halo halo-b" />
          <div className="os-core-lines"><i /><i /><i /><i /><i /><i /></div>
          <div className="os-core">
            <span className="os-core-scan" />
            <b>ERP</b>
            <i>NEXT</i>
            <small>SYSTEM CORE / ONLINE</small>
          </div>
          {erpSteps.map((step, index) => (
            <div className={`os-core-node node-${index + 1}`} key={step.no} style={{ "--node-o": `var(--step-${index})` } as React.CSSProperties}>
              <i>{step.no}</i><span>{step.kicker}</span>
            </div>
          ))}
        </div>
        <div className="os-system-copy">
          <div className="os-section-index"><span>03</span><b>ERP JOURNEY</b></div>
          {erpSteps.map((step, index) => (
            <article className="os-system-step" key={step.no} style={{ "--step-o": `var(--step-${index})` } as React.CSSProperties}>
              <p>{step.no} / {step.kicker}</p>
              <h2>{step.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <div><p>{step.text}</p><strong>{step.metric}<small>{step.metricText}</small></strong></div>
            </article>
          ))}
          <div className="os-step-rail" aria-hidden="true">{erpSteps.map((step, index) => <i key={step.no} style={{ opacity: `var(--step-${index})` }} />)}</div>
        </div>
      </div>
    </section>
  );
}

function WorkGrid() {
  const tilt = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--card-rx", `${-y * 7}deg`);
    event.currentTarget.style.setProperty("--card-ry", `${x * 9}deg`);
  };
  return (
    <section className="os-work" id="work">
      <div className="os-work-head" data-rise>
        <div className="os-section-index"><span>04</span><b>SELECTED SYSTEMS</b></div>
        <h2>Những thứ<br />đang <em>chạy thật.</em></h2>
        <p>Không phải concept. Đây là các bài toán vận hành tôi đã và đang biến thành hệ thống.</p>
      </div>
      <div className="os-project-grid">
        {projects.map(([label, title, tags, no], index) => (
          <article className={`os-project project-${index + 1}`} key={no} data-rise onPointerMove={tilt} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--card-rx", "0deg"); event.currentTarget.style.setProperty("--card-ry", "0deg"); }}>
            <div className="os-project-top"><span>{label}</span><b>{no}</b></div>
            <h3>{title}</h3>
            <div className="os-project-bottom"><p>{tags}</p><i>↗</i></div>
            <div className="os-project-visual" aria-hidden="true"><i /><i /><i /><span>{index % 2 === 0 ? "◫" : "⌁"}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="os-journal">
      <div className="os-journal-head" data-rise>
        <div className="os-section-index"><span>05</span><b>FIELD NOTES</b></div>
        <h2>Ghi chép từ<br /><em>hiện trường.</em></h2>
        <Link href="/blog">XEM TOÀN BỘ TẠP CHÍ <span>↗</span></Link>
      </div>
      <div className="os-issues">
        {posts.slice(0, 3).map((post, index) => (
          <Link className="os-issue" href={`/blog/${post.slug}`} key={post.slug} data-rise>
            <div className="os-issue-cover">
              <div className="os-issue-mast"><span>1 NGƯỜI</span><b>ISSUE / 00{index + 1}</b></div>
              <img src={post.coverImage} alt="" width={1024} height={1536} />
              <div className="os-issue-title"><i>{post.category}</i><h3>{post.title}</h3></div>
              <span className="os-issue-metric">{post.metric}</span>
            </div>
            <div className="os-issue-meta"><span>{post.date}</span><b>ĐỌC BÀI ↗</b></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Finale() {
  return (
    <footer className="os-finale" data-rise>
      <div className="os-finale-signal" aria-hidden="true"><i /><i /><i /><i /></div>
      <p>1 NGƯỜI / OPEN SYSTEM / 2026</p>
      <h2>KHÔNG CẦN LÀM<br />MỌI THỨ <em>MỘT MÌNH.</em></h2>
      <div className="os-finale-bottom">
        <p>Chỉ cần xây được một hệ thống để những gì đã học, đã làm và đã tạo ra tiếp tục sinh giá trị.</p>
        <Link href="/tools">MỞ HỘP CÔNG CỤ <span>↗</span></Link>
      </div>
      <div className="os-footer-line"><span>© 2026 NGUYỄN HUY CHIẾN</span><span>HẢI PHÒNG, VIỆT NAM</span><span>ONE PERSON / MANY SYSTEMS</span></div>
    </footer>
  );
}

export default function HomeExperience() {
  useScrollScene();
  return (
    <main className="os-shell">
      <PointerGlow />
      <Header />
      <ScrollProgress />
      <Portal />
      <Manifesto />
      <RoleCorridor />
      <SystemCore />
      <WorkGrid />
      <Journal />
      <Finale />
      <div className="os-noise" aria-hidden="true" />
    </main>
  );
}
