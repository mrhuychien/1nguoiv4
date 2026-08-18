"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { posts } from "../content";

const journeyScenes = [
  {
    index: "00",
    eyebrow: "NGUYỄN HUY CHIẾN / HẢI PHÒNG",
    display: ["MỘT", "NGƯỜI"],
    accent: "NHIỀU HỆ THỐNG.",
    body: "Tôi xây hệ thống để công việc bớt phụ thuộc vào trí nhớ — và để một người có thể tạo ra nhiều giá trị hơn.",
  },
  {
    index: "01",
    eyebrow: "THE ORIGIN / ĐIỂM BẮT ĐẦU",
    display: ["KHÔNG PHẢI", "CÔNG NGHỆ."],
    accent: "MÀ LÀ MA SÁT.",
    body: "Báo cáo đến muộn. Dữ liệu nằm rải rác. Công việc lặp lại. Tôi bắt đầu bằng việc nhìn thật kỹ những chỗ tổ chức đang mất thời gian.",
  },
  {
    index: "02",
    eyebrow: "THE CORE / HÀNH TRÌNH ERP",
    display: ["BIẾN VIỆC", "THÀNH LUỒNG."],
    accent: "BIẾN LUỒNG THÀNH HỆ THỐNG.",
    body: "ERPNext kết nối bán hàng, kho, mua hàng, kế toán, sản xuất và nhân sự vào cùng một nhịp dữ liệu.",
  },
  {
    index: "03",
    eyebrow: "THE LEVERAGE / AI × AUTOMATION",
    display: ["MỘT NGƯỜI.", "NHIỀU VAI."],
    accent: "MỘT LÕI VẬN HÀNH.",
    body: "API, n8n, BI và AI làm phần lặp lại. Con người giữ lại phần quan trọng nhất: ngoại lệ, phán đoán và quyết định.",
  },
  {
    index: "04",
    eyebrow: "FIELD NOTES / 1NGUOI.COM",
    display: ["XÂY THẬT.", "GHI THẬT."],
    accent: "CHIA SẺ THỨ DÙNG ĐƯỢC.",
    body: "Đây không chỉ là portfolio. Đây là nhật ký sống của những hệ thống đang được xây, thử, sửa và đưa vào vận hành.",
  },
];

const systems = [
  {
    id: "01",
    title: "ERP CORE",
    headline: "Một lõi dữ liệu cho nhà máy.",
    description: "Bán hàng, kho, kế toán, mua hàng, sản xuất và chấm công không còn là sáu hòn đảo.",
    tags: ["ERPNext", "Frappe", "Operations"],
    image: "/characters/erp-builder.webp",
  },
  {
    id: "02",
    title: "PO READER",
    headline: "Đọc đơn hàng. Hiểu cấu trúc. Đưa vào ERP.",
    description: "Từ PO siêu thị đến chứng từ có cấu trúc, giảm phần nhập liệu lặp lại của con người.",
    tags: ["AI", "Document", "Automation"],
    image: "/characters/multitask.webp",
  },
  {
    id: "03",
    title: "NPP.SALE",
    headline: "Một cách đặt hàng gọn hơn cho FMCG.",
    description: "Thử nghiệm trải nghiệm đặt hàng, theo dõi và quản trị nhà phân phối trên một giao diện nhẹ.",
    tags: ["SaaS", "FMCG", "Product"],
    image: "/characters/kitchen.webp",
  },
  {
    id: "04",
    title: "OPS BI",
    headline: "Từ dữ liệu thành tín hiệu hành động.",
    description: "Doanh số, tồn kho và công nợ được đưa về đúng ngữ cảnh để hỗ trợ quyết định.",
    tags: ["Data", "BI", "Decision"],
    image: "/characters/father.webp",
  },
];

const roles = ["VẬN HÀNH", "ERP", "AI", "DỮ LIỆU", "NGƯỜI CHA", "NGƯỜI HỌC"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function ease(value: number) {
  const v = clamp(value);
  return v * v * (3 - 2 * v);
}

function sceneWeight(progress: number, center: number) {
  const distance = Math.abs(progress - center);
  return ease(1 - distance / 0.175);
}

function LivingCore({ onReady }: { onReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    const startDomTimeline = () => {
      const journey = document.querySelector<HTMLElement>(".lc-journey");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let targetScroll = window.scrollY;
      let smoothScroll = window.scrollY;
      let lastSmooth = smoothScroll;
      let lastTime = performance.now();

      const onScroll = () => { targetScroll = window.scrollY; };
      const animateDom = (time: number) => {
        const delta = Math.min(0.05, (time - lastTime) / 1000);
        lastTime = time;
        const damping = reduceMotion ? 1 : 1 - Math.exp(-delta * 7.5);
        smoothScroll += (targetScroll - smoothScroll) * damping;
        const journeyTop = journey?.offsetTop || 0;
        const journeyTravel = Math.max(1, (journey?.offsetHeight || window.innerHeight) - window.innerHeight);
        const progress = clamp((smoothScroll - journeyTop) / journeyTravel);
        const velocity = clamp(Math.abs(smoothScroll - lastSmooth) / 38);
        lastSmooth = smoothScroll;

        if (journey) {
          journey.style.setProperty("--jp", String(progress));
          journey.style.setProperty("--velocity", String(velocity));
          journeyScenes.forEach((_, index) => {
            journey.style.setProperty(`--scene-${index}`, String(sceneWeight(progress, index / (journeyScenes.length - 1))));
          });
        }
        document.documentElement.style.setProperty(
          "--living-progress",
          String(clamp(smoothScroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))),
        );
        frame = requestAnimationFrame(animateDom);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      frame = requestAnimationFrame(animateDom);
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
      };
      onReady();
    };

    import("three").then((THREE) => {
      if (disposed) return;

      const context =
        canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" }) ||
        canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
      if (!context) {
        startDomTimeline();
        return;
      }
      const renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x050706, 0);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050706, 0.058);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
      camera.position.set(0, 0, 7.4);

      const world = new THREE.Group();
      scene.add(world);

      const coreGeometry = new THREE.IcosahedronGeometry(1.48, 4);
      const basePositions = new Float32Array(coreGeometry.attributes.position.array as ArrayLike<number>);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xcfff25,
        emissive: 0x273600,
        emissiveIntensity: 0.58,
        roughness: 0.18,
        metalness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        transparent: true,
        opacity: 0.96,
        flatShading: true,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      world.add(core);

      const wireGeometry = new THREE.IcosahedronGeometry(1.62, 2);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x7cf5e5,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      const wire = new THREE.Mesh(wireGeometry, wireMaterial);
      world.add(wire);

      const innerGeometry = new THREE.TorusKnotGeometry(0.55, 0.14, 144, 18, 2, 3);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0c1512,
        emissive: 0x55d8c7,
        emissiveIntensity: 0.48,
        metalness: 0.6,
        roughness: 0.25,
      });
      const inner = new THREE.Mesh(innerGeometry, innerMaterial);
      world.add(inner);

      const ringGroup = new THREE.Group();
      const ringColors = [0xcfff25, 0x70ebdb, 0xffffff];
      [2.05, 2.45, 2.9].forEach((radius, index) => {
        const geometry = new THREE.TorusGeometry(radius, index === 0 ? 0.012 : 0.006, 8, 180);
        const material = new THREE.MeshBasicMaterial({
          color: ringColors[index],
          transparent: true,
          opacity: index === 0 ? 0.58 : 0.22,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = 0.7 + index * 0.48;
        ring.rotation.y = 0.25 + index * 0.62;
        ringGroup.add(ring);
      });
      world.add(ringGroup);

      const nodes = new THREE.Group();
      for (let index = 0; index < 18; index += 1) {
        const angle = (index / 18) * Math.PI * 2;
        const radius = 2.08 + (index % 3) * 0.42;
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(index % 5 === 0 ? 0.055 : 0.026, 10, 10),
          new THREE.MeshBasicMaterial({ color: index % 4 === 0 ? 0xcfff25 : 0x72eddd }),
        );
        node.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.7) * 0.86,
          Math.sin(angle) * radius * 0.55,
        );
        nodes.add(node);
      }
      world.add(nodes);

      const particleCount = window.innerWidth < 760 ? 360 : 900;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        const radius = 6 + Math.random() * 18;
        const angle = Math.random() * Math.PI * 2;
        particlePositions[index * 3] = Math.cos(angle) * radius;
        particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 14;
        particlePositions[index * 3 + 2] = Math.sin(angle) * radius - 8;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x91bcb6,
        size: 0.018,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const slabs = new THREE.Group();
      for (let index = 0; index < 7; index += 1) {
        const geometry = new THREE.BoxGeometry(0.92 + (index % 2) * 0.42, 0.012, 0.36);
        const material = new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0xcfff25 : 0x6ee6d7,
          transparent: true,
          opacity: 0.12,
          wireframe: index % 2 === 0,
        });
        const slab = new THREE.Mesh(geometry, material);
        slab.position.set((index - 3) * 0.78, (index % 2 ? 1 : -1) * (2.4 + index * 0.08), -index * 0.4);
        slab.rotation.z = index * 0.18;
        slabs.add(slab);
      }
      world.add(slabs);

      scene.add(new THREE.AmbientLight(0xddebe6, 0.68));
      const key = new THREE.PointLight(0xcfff25, 13, 16, 1.8);
      key.position.set(3.8, 3, 4.5);
      scene.add(key);
      const fill = new THREE.PointLight(0x55e9d5, 9, 15, 2);
      fill.position.set(-4, -2.5, 3);
      scene.add(fill);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let targetScroll = window.scrollY;
      let smoothScroll = window.scrollY;
      let lastSmooth = smoothScroll;
      let lastTime = performance.now();
      const journey = document.querySelector<HTMLElement>(".lc-journey");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const palette = [
        new THREE.Color(0xcfff25),
        new THREE.Color(0xf2f0e9),
        new THREE.Color(0x67ebda),
        new THREE.Color(0xff684d),
        new THREE.Color(0xcfff25),
      ];

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = width < 760 ? 1 : Math.min(window.devicePixelRatio, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const onScroll = () => {
        targetScroll = window.scrollY;
      };
      const onPointer = (event: PointerEvent) => {
        pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
      };

      const animate = (time: number) => {
        const delta = Math.min(0.05, (time - lastTime) / 1000);
        lastTime = time;
        const damping = reduceMotion ? 1 : 1 - Math.exp(-delta * 7.5);
        smoothScroll += (targetScroll - smoothScroll) * damping;
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-delta * 4));
        pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-delta * 4));

        const journeyTop = journey?.offsetTop || 0;
        const journeyTravel = Math.max(1, (journey?.offsetHeight || window.innerHeight) - window.innerHeight);
        const progress = clamp((smoothScroll - journeyTop) / journeyTravel);
        const velocity = clamp(Math.abs(smoothScroll - lastSmooth) / 38);
        lastSmooth = smoothScroll;

        if (journey) {
          journey.style.setProperty("--jp", String(progress));
          journey.style.setProperty("--velocity", String(velocity));
          journeyScenes.forEach((_, index) => {
            journey.style.setProperty(`--scene-${index}`, String(sceneWeight(progress, index / (journeyScenes.length - 1))));
          });
        }
        document.documentElement.style.setProperty(
          "--living-progress",
          String(clamp(smoothScroll / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))),
        );

        const scaled = progress * (palette.length - 1);
        const colorIndex = Math.min(palette.length - 2, Math.floor(scaled));
        const colorMix = ease(scaled - colorIndex);
        coreMaterial.color.copy(palette[colorIndex]).lerp(palette[colorIndex + 1], colorMix);
        coreMaterial.emissive.copy(coreMaterial.color).multiplyScalar(0.18);

        const positionAttribute = coreGeometry.attributes.position;
        const array = positionAttribute.array as Float32Array;
        const pulse = time * 0.00072;
        const deformation = reduceMotion ? 0 : 0.035 + velocity * 0.12;
        for (let index = 0; index < array.length; index += 3) {
          const x = basePositions[index];
          const y = basePositions[index + 1];
          const z = basePositions[index + 2];
          const length = Math.sqrt(x * x + y * y + z * z) || 1;
          const wave = Math.sin(x * 3.1 + pulse * 2.2) * Math.cos(y * 2.7 - pulse) * Math.sin(z * 2.4 + pulse);
          const scale = 1 + wave * deformation;
          array[index] = (x / length) * length * scale;
          array[index + 1] = (y / length) * length * scale;
          array[index + 2] = (z / length) * length * scale;
        }
        positionAttribute.needsUpdate = true;
        coreGeometry.computeVertexNormals();

        const section = Math.min(3.999, progress * 4);
        const local = ease(section - Math.floor(section));
        const positions = [
          [1.45, 0.1, 0],
          [-0.15, -0.05, 0],
          [-1.65, 0.1, 0],
          [1.55, -0.1, 0],
          [0, 0, 0],
        ];
        const from = positions[Math.floor(section)];
        const to = positions[Math.floor(section) + 1];
        world.position.x = THREE.MathUtils.lerp(from[0], to[0], local);
        world.position.y = THREE.MathUtils.lerp(from[1], to[1], local);
        world.scale.setScalar(THREE.MathUtils.lerp(0.92, 1.16, Math.sin(progress * Math.PI)));
        world.rotation.y = progress * Math.PI * 2.15 + pointer.x * 0.13;
        world.rotation.x = progress * 0.7 - pointer.y * 0.1;
        core.rotation.x += delta * (0.22 + velocity * 1.2);
        core.rotation.y -= delta * (0.16 + velocity * 0.9);
        wire.rotation.x -= delta * 0.12;
        wire.rotation.z += delta * 0.16;
        inner.rotation.x += delta * 0.46;
        inner.rotation.y += delta * 0.35;
        ringGroup.rotation.z = progress * Math.PI * 2 + time * 0.00008;
        ringGroup.rotation.y = progress * 1.8;
        nodes.rotation.y = -progress * Math.PI * 2.5;
        slabs.rotation.z = progress * 0.65;
        particles.rotation.y = time * 0.000018 + progress * 0.28;

        camera.position.x = pointer.x * 0.11;
        camera.position.y = -pointer.y * 0.09;
        camera.position.z = 7.2 - Math.sin(progress * Math.PI) * 1.55 - velocity * 0.25;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      resize();
      canvas.dataset.active = "true";
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      frame = requestAnimationFrame(animate);
      onReady();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const material = object.material;
            if (Array.isArray(material)) material.forEach((item) => item.dispose());
            else material.dispose();
          }
        });
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      };
    }).catch(() => startDomTimeline());

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [onReady]);

  return (
    <>
      <canvas className="lc-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="lc-core-fallback" aria-hidden="true">
        <div className="lc-fallback-orbit orbit-a" /><div className="lc-fallback-orbit orbit-b" />
        <div className="lc-fallback-body"><i /><i /><i /><i /><i /></div>
        <span>01</span>
      </div>
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="lc-header">
      <Link className="lc-logo" href="/" aria-label="1 Người — Trang chủ">
        <strong>1</strong><span>NGƯỜI</span><i>®</i>
      </Link>
      <nav className={open ? "lc-nav is-open" : "lc-nav"} aria-label="Điều hướng chính">
        <a href="#story" onClick={() => setOpen(false)}>Câu chuyện</a>
        <a href="#systems" onClick={() => setOpen(false)}>Hệ thống</a>
        <Link href="/blog" onClick={() => setOpen(false)}>Bài viết</Link>
        <Link href="/tools" onClick={() => setOpen(false)}>Công cụ</Link>
      </nav>
      <div className="lc-status"><i /><span>CORE ONLINE</span></div>
      <button className="lc-menu" type="button" aria-label="Mở menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span /><span />
      </button>
    </header>
  );
}

function Journey({ onReady }: { onReady: () => void }) {
  return (
    <section className="lc-journey" id="story">
      <div className="lc-sticky">
        <div className="lc-ambient" aria-hidden="true"><i /><i /><i /></div>
        <div className="lc-canvas-wrap">
          <LivingCore onReady={onReady} />
        </div>

        {journeyScenes.map((scene, index) => (
          <article className={`lc-scene scene-${index}`} key={scene.index}>
            <div className="lc-scene-index"><span>{scene.index}</span><i /><b>0{journeyScenes.length - 1}</b></div>
            <p className="lc-eyebrow">{scene.eyebrow}</p>
            <h1>
              <span>{scene.display[0]}</span>
              <span>{scene.display[1]}</span>
            </h1>
            <div className="lc-scene-foot">
              <strong>{scene.accent}</strong>
              <p>{scene.body}</p>
            </div>
          </article>
        ))}

        <div className="lc-role-orbit" aria-hidden="true">
          {roles.map((role, index) => <span key={role} style={{ "--r": index } as React.CSSProperties}>{role}</span>)}
        </div>

        <div className="lc-flow-map" aria-hidden="true">
          <span>BÁN HÀNG</span><i /><span>KHO</span><i /><span>SẢN XUẤT</span><i /><span>KẾ TOÁN</span><i /><span>NHÂN SỰ</span>
        </div>

        <div className="lc-scroll-note"><span>KÉO ĐỂ ĐI XUYÊN QUA HỆ THỐNG</span><i><b /></i></div>
        <div className="lc-progress" aria-hidden="true"><i /><span>0</span><b>100</b></div>
      </div>
    </section>
  );
}

function Systems() {
  return (
    <section className="lc-systems" id="systems">
      <header className="lc-systems-head">
        <div><span>05</span><b>SELECTED SYSTEMS</b></div>
        <h2>Những thứ<br />đang <em>chạy thật.</em></h2>
        <p>Bốn bài toán đại diện cho cách tôi làm việc: bắt đầu từ ma sát, tìm đúng cấu trúc và xây một hệ thống đủ nhẹ để con người dùng được.</p>
      </header>

      <div className="lc-system-list">
        {systems.map((system) => (
          <article className="lc-system-card" key={system.id}>
            <div className="lc-system-visual">
              <img src={system.image} alt="" width={1024} height={1536} />
              <span>{system.id}</span>
              <i aria-hidden="true" />
            </div>
            <div className="lc-system-copy">
              <div><span>{system.id} / 04</span><b>{system.title}</b></div>
              <h3>{system.headline}</h3>
              <p>{system.description}</p>
              <ul>{system.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="lc-journal" id="journal">
      <header className="lc-journal-head">
        <p>06 / FIELD NOTES</p>
        <h2>Ý tưởng chỉ có giá trị<br />khi được <em>kiểm chứng.</em></h2>
        <Link href="/blog">MỞ TOÀN BỘ TẠP CHÍ <span>↗</span></Link>
      </header>
      <div className="lc-issue-grid">
        {posts.slice(0, 3).map((post, index) => (
          <Link className="lc-issue" href={`/blog/${post.slug}`} key={post.slug}>
            <div className="lc-issue-top"><span>1 NGƯỜI / 00{index + 1}</span><b>{post.category}</b></div>
            <h3>{post.title}</h3>
            <img src={post.coverImage} alt="" width={1024} height={1536} />
            <div className="lc-issue-bottom"><strong>{post.metric}</strong><span>ĐỌC BÀI ↗</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lc-footer">
      <p>ONE PERSON / MANY SYSTEMS</p>
      <h2>BUILD<br /><span>WHAT MATTERS.</span></h2>
      <div className="lc-footer-row">
        <p>Tôi tiếp tục học, xây và ghi lại những thứ có thể giúp một người làm việc lớn hơn mà không phải tự làm mọi thứ.</p>
        <Link href="/tools">MỞ HỘP CÔNG CỤ <span>↗</span></Link>
      </div>
      <div className="lc-footer-meta"><span>© 2026 NGUYỄN HUY CHIẾN</span><span>HẢI PHÒNG / VIỆT NAM</span><span>1NGUOI.COM</span></div>
    </footer>
  );
}

export default function HomeExperience() {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const fallback = window.setTimeout(() => setReady(true), 2600);
    return () => {
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <main className={ready ? "lc-shell is-ready" : "lc-shell"}>
      <div className="lc-loader" aria-hidden="true"><span>1</span><i /></div>
      <Header />
      <Journey onReady={handleReady} />
      <Systems />
      <Journal />
      <Footer />
      <div className="lc-grain" aria-hidden="true" />
    </main>
  );
}
