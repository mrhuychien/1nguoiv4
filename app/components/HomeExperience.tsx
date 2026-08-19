"use client";

/* eslint-disable @next/next/no-img-element -- Sites preview/runtime serves these local character assets directly. */

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { posts, toolsDirectory } from "../content";

const chapters = [
  {
    code: "00",
    label: "NGUYỄN HUY CHIẾN / HẢI PHÒNG",
    title: ["MỘT NGƯỜI.", "CẢ MỘT THẾ GIỚI", "ĐANG CHẠY."],
    lead: "Một sa bàn sống của công việc, công nghệ và đời thường.",
    body: "Tôi xây hệ thống để công việc bớt phụ thuộc vào trí nhớ — và để một người có thể tạo ra nhiều giá trị hơn.",
  },
  {
    code: "01",
    label: "THE FRICTION / ĐIỂM BẮT ĐẦU",
    title: ["NHÌN THẤY", "MA SÁT", "TRONG VẬN HÀNH."],
    lead: "Báo cáo muộn. Dữ liệu rời. Công việc lặp.",
    body: "Tôi bắt đầu từ những nơi con người đang phải nhớ quá nhiều, nhập lại quá nhiều và chờ đợi quá lâu.",
  },
  {
    code: "02",
    label: "THE FACTORY / ERP CORE",
    title: ["BIẾN VIỆC", "THÀNH LUỒNG.", "BIẾN LUỒNG THÀNH HỆ THỐNG."],
    lead: "ERPNext là phần lõi, không phải đích đến.",
    body: "Bán hàng, kho, mua hàng, kế toán, sản xuất và nhân sự cùng chạy trên một nhịp dữ liệu có thể quan sát được.",
  },
  {
    code: "03",
    label: "THE LEVERAGE / AI × AUTOMATION",
    title: ["MÁY LÀM", "PHẦN LẶP.", "NGƯỜI GIỮ PHẦN QUAN TRỌNG."],
    lead: "API, n8n, BI và AI trở thành những cỗ máy nhỏ.",
    body: "Tự động hóa không thay phán đoán. Nó trả lại thời gian để con người giải quyết ngoại lệ và đưa ra quyết định.",
  },
  {
    code: "04",
    label: "FIELD NOTES / 1NGUOI.COM",
    title: ["XÂY THẬT.", "THỬ THẬT.", "GHI LẠI THỨ DÙNG ĐƯỢC."],
    lead: "Portfolio này không đứng yên.",
    body: "Nó là nhật ký của những hệ thống đang được xây, sửa, đưa vào vận hành — và những bài học đủ thật để chia sẻ.",
  },
];

const worlds = [
  { no: "01", kicker: "OPERATING ROOM", title: "Một người, nhiều vai vận hành.", body: "Tôi đứng ở nơi dữ liệu, con người, hàng hóa, tiến độ và những ngoại lệ va vào nhau mỗi ngày.", image: "/characters/multitask.webp", tone: "lime", tags: ["OPERATIONS", "DECISION", "SYSTEM THINKING"], signals: ["OPS", "ERP", "AI"] },
  { no: "02", kicker: "ERP FACTORY", title: "Một lõi dữ liệu cho nhà máy.", body: "ERPNext nối bán hàng, kho, mua hàng, kế toán, sản xuất và chấm công thành một dòng vận hành chung.", image: "/characters/erp-builder.webp", tone: "blue", tags: ["ERPNEXT", "FRAPPE", "MANUFACTURING"], signals: ["LIVE", "DATA", "FLOW"] },
  { no: "03", kicker: "EVERYDAY LAB", title: "Công nghệ phải trả lại thời gian sống.", body: "Sau màn hình vẫn là một người nấu cơm, chăm con, đọc sách và học tiếp. Hệ thống tốt phải làm đời sống nhẹ hơn.", image: "/characters/kitchen.webp", tone: "orange", tags: ["FAMILY", "LEARNING", "BALANCE"], signals: ["TIME", "CARE", "LIFE"] },
  { no: "04", kicker: "HUMAN CORE", title: "Kiên nhẫn cũng là một năng lực thiết kế.", body: "Những bài học quan trọng về quan sát, hiện diện và cải tiến đôi khi đến từ gia đình, không phải phòng họp.", image: "/characters/father.webp", tone: "violet", tags: ["FATHER", "PATIENCE", "GROWTH"], signals: ["CARE", "LEARN", "GROW"] },
];

const flowSteps = [
  ["01", "NHÌN", "Tìm đúng điểm ma sát trước khi nói về phần mềm."],
  ["02", "MÔ HÌNH", "Tách đầu vào, trạng thái, trách nhiệm và điều kiện hoàn tất."],
  ["03", "KẾT NỐI", "Đưa dữ liệu lõi về ERP và nối các phòng ban."],
  ["04", "TỰ ĐỘNG", "Cho máy xử lý phần lặp lại, có kiểm soát và truy vết."],
  ["05", "ĐO LƯỜNG", "Biến dữ liệu thành tín hiệu để tiếp tục cải tiến."],
];

function clamp(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
function ease(value: number) { const v = clamp(value); return v * v * (3 - 2 * v); }
function weight(progress: number, center: number) { return ease(1 - Math.abs(progress - center) / 0.18); }

function IsoWorld({ onReady }: { onReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const journey = document.querySelector<HTMLElement>(".iso-journey");
    if (!canvas || !journey) return;

    let disposed = false;
    let frame = 0;
    let targetScroll = window.scrollY;
    let smoothScroll = window.scrollY;
    let previousScroll = smoothScroll;
    let previousTime = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type RenderWorld = (time: number, delta: number, progress: number, velocity: number) => void;
    let renderWorld: RenderWorld = () => {};
    let resizeWorld = () => {};
    let disposeWorld = () => {};

    const onScroll = () => { targetScroll = window.scrollY; };
    const onPointer = (event: PointerEvent) => { pointer.tx = event.clientX / window.innerWidth - 0.5; pointer.ty = event.clientY / window.innerHeight - 0.5; };
    const onResize = () => resizeWorld();

    const loop = (time: number) => {
      const delta = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000));
      previousTime = time;
      const damping = reduceMotion ? 1 : 1 - Math.exp(-delta * 7.2);
      smoothScroll += (targetScroll - smoothScroll) * damping;
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-delta * 4.2));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-delta * 4.2));
      const travel = Math.max(1, journey.offsetHeight - window.innerHeight);
      const progress = clamp((smoothScroll - journey.offsetTop) / travel);
      const velocity = clamp(Math.abs(smoothScroll - previousScroll) / 34);
      previousScroll = smoothScroll;
      journey.style.setProperty("--iso-p", String(progress));
      journey.style.setProperty("--iso-v", String(velocity));
      journey.style.setProperty("--iso-mx", String(pointer.x));
      journey.style.setProperty("--iso-my", String(pointer.y));
      chapters.forEach((_, index) => journey.style.setProperty(`--chapter-${index}`, String(weight(progress, index / (chapters.length - 1)))));
      document.documentElement.style.setProperty("--iso-page", String(clamp(smoothScroll / Math.max(1, document.documentElement.scrollHeight - innerHeight))));
      renderWorld(time, delta, progress, velocity);
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(loop);
    onReady();

    import("three").then((THREE) => {
      if (disposed) return;
      const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" }) || canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
      if (!context) return;
      const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = window.innerWidth > 760;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0xf2efe5, 0);
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf2efe5, 11, 24);
      const camera = new THREE.OrthographicCamera(-7, 7, 7, -7, 0.1, 80);
      camera.position.set(10, 9, 10);
      camera.lookAt(0, 0, 0);
      const world = new THREE.Group();
      world.rotation.y = -0.22;
      scene.add(world);

      const material = (color: number, roughness = 0.72, metalness = 0.06) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
      const ink = material(0x14231f, 0.48, 0.28);
      const paper = material(0xe7e1d3, 0.88, 0);
      const lime = material(0xd7ff3f, 0.55, 0.04);
      const aqua = material(0x5ce4cf, 0.42, 0.12);
      const orange = material(0xff7047, 0.62, 0.03);
      const violet = material(0x6f65ff, 0.52, 0.08);
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x91fff0, transparent: true, opacity: 0.32, roughness: 0.08, transmission: 0.25 });

      const base = new THREE.Mesh(new THREE.CylinderGeometry(5.55, 5.8, 0.48, 6), paper);
      base.rotation.y = Math.PI / 6; base.position.y = -0.28; base.receiveShadow = true; world.add(base);
      const under = new THREE.Mesh(new THREE.CylinderGeometry(5.72, 5.95, 0.25, 6), ink);
      under.rotation.y = Math.PI / 6; under.position.y = -0.61; world.add(under);
      const grid = new THREE.GridHelper(10, 20, 0x89b9af, 0xb8c7bf);
      grid.position.y = -0.02; grid.material.transparent = true; grid.material.opacity = 0.22; world.add(grid);

      const roomGroups: InstanceType<typeof THREE.Group>[] = [];
      const addBlock = (x: number, z: number, w: number, d: number, h: number, mat: InstanceType<typeof THREE.MeshStandardMaterial>, phase: number) => {
        const group = new THREE.Group();
        const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), paper); floor.position.y = 0.06; floor.receiveShadow = true; group.add(floor);
        const building = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h, d * 0.58), mat); building.position.set(0, h / 2 + 0.13, 0.08); building.castShadow = true; building.receiveShadow = true; group.add(building);
        const top = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 0.08, d * 0.38), glass); top.position.set(0, h + 0.18, 0.08); group.add(top);
        group.position.set(x, -0.1, z); group.userData.baseY = group.position.y; group.userData.phase = phase; world.add(group); roomGroups.push(group);
      };
      addBlock(-3.2, -1.85, 2.1, 1.55, 1.45, orange, 0.05);
      addBlock(-0.85, -2.25, 1.85, 1.15, 1.05, aqua, 0.22);
      addBlock(1.55, -2.08, 1.7, 1.4, 1.72, violet, 0.42);
      addBlock(3.25, -0.35, 1.55, 1.9, 1.18, lime, 0.58);
      addBlock(2.15, 2.15, 2.2, 1.55, 1.45, orange, 0.76);
      addBlock(-0.55, 2.55, 2.4, 1.35, 1.1, aqua, 0.88);
      addBlock(-3.05, 1.55, 1.75, 2.0, 1.58, violet, 0.96);

      const makeScreen = (x: number, y: number, z: number, rotation = 0) => {
        const monitor = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.72, 0.08), ink); monitor.position.set(x, y, z); monitor.rotation.y = rotation; monitor.castShadow = true;
        const display = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.52), lime); display.position.set(0, 0, 0.046); monitor.add(display); world.add(monitor);
      };
      makeScreen(-3.2, 1.05, -0.96); makeScreen(-0.85, 0.94, -1.62); makeScreen(2.18, 1.15, 2.92, Math.PI);

      const human = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 24), material(0xf1b080, 0.8, 0)); head.position.y = 2.22; head.castShadow = true; human.add(head);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.318, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), ink); hair.position.y = 2.31; human.add(hair);
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.16, 0.5), ink); torso.position.y = 1.42; torso.castShadow = true; human.add(torso);
      [-0.2, 0.2].forEach((x) => { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.95, 0.28), material(0x263333, 0.78, 0)); leg.position.set(x, 0.48, 0); leg.castShadow = true; human.add(leg); });
      const beam = (start: InstanceType<typeof THREE.Vector3>, end: InstanceType<typeof THREE.Vector3>) => { const direction = end.clone().sub(start); const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, direction.length(), 12), ink); mesh.position.copy(start).add(end).multiplyScalar(0.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()); mesh.castShadow = true; human.add(mesh); };
      const endpoints = [new THREE.Vector3(-1.05, 2.05, 0.08), new THREE.Vector3(1.05, 2.02, 0.04), new THREE.Vector3(-1.18, 1.55, 0.12), new THREE.Vector3(1.15, 1.48, 0.1), new THREE.Vector3(-0.92, 1.06, 0.18), new THREE.Vector3(0.92, 1.0, 0.16)];
      endpoints.forEach((end) => beam(new THREE.Vector3(end.x < 0 ? -0.28 : 0.28, 1.72, 0), end));
      human.position.set(0.15, 0, -0.05); world.add(human);

      const curveA = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.1, 0.18, -2), new THREE.Vector3(-2.1, 0.18, -2.9), new THREE.Vector3(0, 0.18, -2.75), new THREE.Vector3(2.8, 0.18, -1.5), new THREE.Vector3(3.2, 0.18, 1.8), new THREE.Vector3(0.2, 0.18, 3.4), new THREE.Vector3(-3.8, 0.18, 1.75)], true, "catmullrom", 0.25);
      const curveB = new THREE.CatmullRomCurve3([new THREE.Vector3(-3.2, 0.35, 1.6), new THREE.Vector3(-1.5, 0.35, 0.5), new THREE.Vector3(0.2, 0.35, -0.05), new THREE.Vector3(1.9, 0.35, 0.7), new THREE.Vector3(2.2, 0.35, 2.1)]);
      [curveA, curveB].forEach((curve, index) => world.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 180, index ? 0.024 : 0.035, 8, index === 0), index ? aqua : lime)));
      const orbs = Array.from({ length: 14 }, (_, index) => { const orb = new THREE.Mesh(new THREE.SphereGeometry(index % 4 ? 0.055 : 0.09, 12, 12), index % 3 ? lime : aqua); world.add(orb); return orb; });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.1, 0.025, 8, 160), new THREE.MeshBasicMaterial({ color: 0x5ce4cf, transparent: true, opacity: 0.35 })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.18; world.add(ring);
      scene.add(new THREE.HemisphereLight(0xfff7df, 0x6d7f76, 2.4));
      const key = new THREE.DirectionalLight(0xffffff, 4.6); key.position.set(-5, 10, 7); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
      const fill = new THREE.PointLight(0x5ce4cf, 12, 22, 2); fill.position.set(4, 4, 5); scene.add(fill);

      resizeWorld = () => { const width = window.innerWidth; const height = window.innerHeight; const aspect = width / height; const view = width < 760 ? 6.5 : 5.45; camera.left = -view * aspect; camera.right = view * aspect; camera.top = view; camera.bottom = -view; camera.updateProjectionMatrix(); renderer.setPixelRatio(width < 760 ? 1 : Math.min(devicePixelRatio, 1.45)); renderer.setSize(width, height, false); };
      renderWorld = (time, delta, progress, velocity) => {
        const pulse = time * 0.001; world.rotation.y = -0.32 + progress * 1.03 + pointer.x * 0.08; world.rotation.x = pointer.y * 0.025; world.position.x = Math.sin(progress * Math.PI * 3.5) * 0.48; world.position.y = -0.18 + Math.sin(progress * Math.PI) * 0.28; world.scale.setScalar(0.9 + Math.sin(progress * Math.PI) * 0.12); human.rotation.y = -world.rotation.y + 0.18; human.position.y = Math.sin(pulse * 1.35) * 0.035;
        roomGroups.forEach((group) => { const active = ease(1 - Math.abs(progress - group.userData.phase) / 0.26); group.position.y = group.userData.baseY + active * 0.48 + Math.sin(pulse + group.userData.phase * 9) * 0.025; });
        orbs.forEach((orb, index) => { const curve = index < 9 ? curveA : curveB; const localIndex = index < 9 ? index : index - 9; const count = index < 9 ? 9 : 5; const point = curve.getPointAt((time * (index < 9 ? 0.000045 : 0.00007) + localIndex / count + progress * 0.28) % 1); orb.position.copy(point); orb.position.y += 0.08 + Math.sin(pulse * 2 + index) * 0.045; orb.scale.setScalar(1 + velocity * 1.8); });
        ring.rotation.z += delta * (0.08 + velocity * 0.22); camera.position.x = 10 + pointer.x * 0.85; camera.position.y = 9 - pointer.y * 0.55; camera.position.z = 10 + Math.sin(progress * Math.PI * 2) * 0.7; camera.lookAt(0, 0.35, 0); renderer.render(scene, camera);
      };
      resizeWorld(); canvas.dataset.active = "true";
      disposeWorld = () => { scene.traverse((object) => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const objectMaterial = object.material; if (Array.isArray(objectMaterial)) objectMaterial.forEach((item) => item.dispose()); else objectMaterial.dispose(); } }); renderer.dispose(); };
    }).catch(() => {});

    return () => { disposed = true; cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onPointer); window.removeEventListener("resize", onResize); disposeWorld(); };
  }, [onReady]);

  const blocks = [[18, 68, 72, "lime"], [34, 75, 112, "ink"], [52, 70, 86, "blue"], [70, 62, 124, "orange"], [76, 43, 78, "lime"], [62, 30, 110, "ink"], [42, 27, 68, "blue"], [23, 38, 105, "orange"], [36, 51, 55, "cream"], [54, 50, 90, "violet"], [66, 75, 48, "cream"], [27, 20, 58, "violet"]];
  return <div className="iso-world-layer" aria-hidden="true"><canvas className="iso-world-canvas" ref={canvasRef} /><div className="iso-css-city"><div className="iso-css-platform" /><div className="iso-css-grid" />{blocks.map(([x, y, h, tone], index) => <i key={index} className={`iso-css-block tone-${tone}`} style={{ "--ix": `${x}%`, "--iy": `${y}%`, "--ih": `${h}px`, "--delay": `${index * -0.21}s` } as CSSProperties} />)}<div className="iso-css-route route-a"><b /><b /><b /></div><div className="iso-css-route route-b"><b /><b /></div></div></div>;
}

function IsoHeader() {
  const [open, setOpen] = useState(false);
  return <header className="iso-header"><Link className="iso-brand" href="/" aria-label="1 Người — Trang chủ"><b>1</b><span>NGƯỜI</span><i>ISOMETRIC WORLD</i></Link><nav className={open ? "iso-nav is-open" : "iso-nav"} aria-label="Điều hướng chính"><a href="#worlds" onClick={() => setOpen(false)}>Thế giới</a><a href="#flow" onClick={() => setOpen(false)}>Hành trình ERP</a><Link href="/blog" onClick={() => setOpen(false)}>Bài viết</Link><Link href="/tools" onClick={() => setOpen(false)}>Công cụ</Link></nav><div className="iso-online"><i /> WORLD ONLINE</div><button className="iso-menu" type="button" aria-label="Mở menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><i /><i /></button></header>;
}

function Hero({ onReady }: { onReady: () => void }) {
  return <section className="iso-journey" id="top"><div className="iso-journey-sticky"><IsoWorld onReady={onReady} /><div className="iso-hero-character" aria-hidden="true"><div className="iso-character-shadow" /><img src="/characters/multitask.webp" alt="" width={1024} height={1536} /><span>HUMAN<br />CORE</span></div>{chapters.map((chapter, index) => <article className={`iso-chapter chapter-${index}`} key={chapter.code}><div className="iso-chapter-code"><span>{chapter.code}</span><i />04</div><p className="iso-chapter-label">{chapter.label}</p><h1>{chapter.title.map((line) => <span key={line}>{line}</span>)}</h1><div className="iso-chapter-foot"><strong>{chapter.lead}</strong><p>{chapter.body}</p></div></article>)}<div className="iso-hud hud-left"><span>CAM / ISO-45°</span><span>SYS / 01</span><span>LOC / HẢI PHÒNG</span></div><div className="iso-hud hud-right"><span>ERP</span><span>AI</span><span>OPS</span><span>LIFE</span></div><div className="iso-scroll-cue"><span>KÉO ĐỂ DI CHUYỂN CAMERA</span><i><b /></i></div><div className="iso-progress"><b /><span>00</span><i /><span>100</span></div></div></section>;
}

function Manifesto() {
  return <section className="iso-manifesto iso-reveal"><div className="iso-section-label"><span>05</span> THE PRINCIPLE</div><p>Không phải một portfolio trưng bày.</p><h2>Một <em>mô hình sống</em><br />của cách tôi<br /><span>nhìn — xây — học.</span></h2><div className="iso-manifesto-copy"><p>Mỗi hệ thống bắt đầu từ một điểm ma sát thật. Mỗi công cụ phải đi tới một hành vi tốt hơn. Mỗi bài viết là một lần kiểm nghiệm lại điều mình tưởng đã hiểu.</p><p>1nguoi.com ghi lại hành trình đó — từ nhà máy, ERP và dữ liệu tới AI, gia đình và việc học suốt đời.</p></div><div className="iso-mini-cube" aria-hidden="true"><i /><i /><i /><b>1</b></div></section>;
}

function Worlds() {
  return <section className="iso-worlds" id="worlds"><header className="iso-worlds-head iso-reveal"><div className="iso-section-label"><span>06</span> FOUR ROOMS / ONE LIFE</div><h2>Bốn căn phòng.<br /><em>Một người ở giữa.</em></h2><p>Công việc và đời sống không phải hai hệ riêng biệt. Chúng cùng tác động lên cách tôi quan sát, thiết kế và ra quyết định.</p></header><div className="iso-room-list">{worlds.map((world, worldIndex) => <article className={`iso-room tone-${world.tone} iso-reveal`} key={world.no}><div className={`iso-room-visual scene-${worldIndex}`} data-diorama><div className="iso-room-grid" /><strong>{world.no}</strong><span>LIVE / {world.kicker}</span><div className="iso-diorama-stage" aria-hidden="true"><div className="iso-diorama-shadow" /><div className="iso-room-platform"><i /><i /><i /></div><div className="iso-room-orbit"><b /><b /><b /></div><div className="iso-image-volume"><div className="iso-image-float"><img src={world.image} alt="" width={1024} height={1536} /><i className="iso-image-glint" /></div></div><div className="iso-motion-rails"><i /><i /><i /></div><div className="iso-motion-packets">{Array.from({ length: 6 }, (_, index) => <i key={index} style={{ "--packet": index, "--delay": `${index * -0.76}s`, "--spread": `${(index - 2.5) * 8}px` } as CSSProperties} />)}</div><div className="iso-motion-signals">{world.signals.map((signal, index) => <b key={signal} style={{ "--signal": index, "--signal-z": `${170 + index * 15}px`, "--delay": `${index * -1.3}s` } as CSSProperties}>{signal}</b>)}</div><div className="iso-diorama-axis"><i>X</i><i>Y</i><i>Z</i></div></div><div className="iso-diorama-status"><span>MOTION / ON</span><i /><b>DEPTH {String(worldIndex + 1).padStart(2, "0")}</b></div></div><div className="iso-room-copy"><div><span>{world.no} / 04</span><b>{world.kicker}</b></div><h3>{world.title}</h3><p>{world.body}</p><ul>{world.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></article>)}</div></section>;
}

function Flow() {
  return <section className="iso-flow" id="flow"><div className="iso-flow-sticky"><div className="iso-section-label"><span>07</span> ERP JOURNEY / OPERATING FLOW</div><h2>Từ ma sát<br />tới <em>dòng chảy.</em></h2><p>Một quy trình đủ tốt phải nhìn được, đo được và tiếp tục thay đổi được.</p><div className="iso-flow-machine" aria-hidden="true"><div className="machine-base" />{flowSteps.map((step, index) => <i key={step[0]} style={{ "--step": index } as CSSProperties}><b>{step[0]}</b></i>)}<div className="machine-rail"><b /><b /><b /></div></div></div><div className="iso-flow-steps">{flowSteps.map((step) => <article className="iso-flow-step iso-reveal" key={step[0]}><span>{step[0]}</span><div><b>{step[1]}</b><p>{step[2]}</p></div><i>↘</i></article>)}</div></section>;
}

function Toolbelt() {
  return <section className="iso-toolbelt"><header className="iso-reveal"><div className="iso-section-label"><span>08</span> OPEN TOOLBOX</div><h2>Không chỉ viết.<br /><em>Xây thứ dùng được.</em></h2><Link href="/tools">MỞ TOÀN BỘ CÔNG CỤ ↗</Link></header><div className="iso-tool-grid">{toolsDirectory.map((tool, index) => { const content = <><span>0{index + 1}</span><i>{tool.symbol}</i><small>{tool.category}</small><h3>{tool.title}</h3><p>{tool.description}</p><b>{tool.status}</b></>; return tool.status === "Dùng ngay" ? <Link className="iso-tool iso-reveal" href={`/tools/${tool.slug}`} key={tool.slug}>{content}</Link> : <article className="iso-tool iso-reveal" key={tool.slug}>{content}</article>; })}</div></section>;
}

function Journal() {
  return <section className="iso-journal" id="journal"><header className="iso-reveal"><div className="iso-section-label"><span>09</span> FIELD NOTES / E-MAGAZINE</div><h2>Những điều<br />đã đi qua <em>thực tế.</em></h2><Link href="/blog">ĐỌC TOÀN BỘ TẠP CHÍ ↗</Link></header><div className="iso-magazine-shelf">{posts.slice(0, 3).map((post, index) => <Link className={`iso-magazine issue-${index + 1} iso-reveal`} href={`/blog/${post.slug}`} key={post.slug}><div className="iso-magazine-edge" /><div className="iso-magazine-cover"><div className="iso-magazine-mast"><b>1 NGƯỜI</b><span>00{index + 1} / 2026</span></div><small>{post.category}</small><h3>{post.title}</h3><img src={post.coverImage} alt="" width={1024} height={1536} loading="lazy" /><strong>{post.metric}</strong><div><span>{post.readTime}</span><b>ĐỌC BÀI ↗</b></div></div></Link>)}</div></section>;
}

function Finale() {
  return <footer className="iso-finale"><div className="iso-finale-city" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><p>ONE PERSON / MANY SYSTEMS</p><h2>BUILD THE<br /><span>WORLD YOU</span><br />WANT TO LIVE IN.</h2><div className="iso-finale-row"><p>Tôi tiếp tục học, xây và ghi lại những thứ giúp một người làm việc lớn hơn mà không phải tự làm mọi thứ.</p><Link href="/blog">BẮT ĐẦU TỪ MỘT BÀI VIẾT <span>↗</span></Link></div><div className="iso-finale-meta"><span>© 2026 NGUYỄN HUY CHIẾN</span><span>HẢI PHÒNG / VIỆT NAM</span><span>1NGUOI.COM</span></div></footer>;
}

export default function HomeExperience() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => { const nodes = Array.from(document.querySelectorAll<HTMLElement>(".iso-reveal")); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: 0.12 }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, []);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-diorama]"));
    if (!nodes.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let frame = 0;
    let previous = performance.now();
    const onPointer = (event: PointerEvent) => { pointer.tx = event.clientX / window.innerWidth - 0.5; pointer.ty = event.clientY / window.innerHeight - 0.5; };
    const tick = (time: number) => {
      const delta = Math.min(0.05, Math.max(0.001, (time - previous) / 1000));
      previous = time;
      const damping = reduceMotion ? 1 : 1 - Math.exp(-delta * 5.8);
      pointer.x += (pointer.tx - pointer.x) * damping;
      pointer.y += (pointer.ty - pointer.y) * damping;
      const viewport = window.innerHeight;
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -viewport * 0.35 || rect.top > viewport * 1.35) return;
        const progress = reduceMotion ? 0.5 : clamp((viewport - rect.top) / (viewport + rect.height));
        node.style.setProperty("--room-p", String(progress));
        node.style.setProperty("--room-shift", `${reduceMotion ? 0 : (0.5 - progress) * 42}px`);
        node.style.setProperty("--room-rx", `${reduceMotion ? 0 : pointer.y * -5 + (progress - 0.5) * 2}deg`);
        node.style.setProperty("--room-ry", `${reduceMotion ? 0 : pointer.x * 7 + (progress - 0.5) * 5}deg`);
      });
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", onPointer); };
  }, []);
  return <main className={ready ? "iso-shell is-ready" : "iso-shell"}><div className="iso-loader"><b>1</b><span>ASSEMBLING ISOMETRIC WORLD</span><i /></div><div className="iso-noise" aria-hidden="true" /><IsoHeader /><Hero onReady={onReady} /><Manifesto /><Worlds /><Flow /><Toolbelt /><Journal /><Finale /></main>;
}
