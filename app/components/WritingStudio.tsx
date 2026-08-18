"use client";

import { useEffect, useState } from "react";

type Draft = { title: string; category: string; excerpt: string; body: string };
const blank: Draft = { title: "", category: "Góc nhìn", excerpt: "", body: "" };

export default function WritingStudio() {
  const [draft, setDraft] = useState<Draft>(blank);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("1nguoi-writing-draft");
    if (stored) {
      try { setDraft(JSON.parse(stored) as Draft); } catch { /* bỏ qua bản nháp lỗi */ }
    }
  }, []);

  const update = (key: keyof Draft, value: string) => { setDraft((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = () => { window.localStorage.setItem("1nguoi-writing-draft", JSON.stringify(draft)); setSaved(true); };
  const exportMarkdown = () => {
    const slug = draft.title.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bai-viet-moi";
    const markdown = `---\ntitle: "${draft.title.replaceAll('"', '\\"')}"\ncategory: "${draft.category}"\nexcerpt: "${draft.excerpt.replaceAll('"', '\\"')}"\ndate: "${new Date().toISOString().slice(0, 10)}"\n---\n\n${draft.body}\n`;
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${slug}.md`; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="writing-studio">
      <header><p className="section-code dark-code">CONTENT STUDIO / LOCAL DRAFT</p><h1>Bàn viết.</h1><p>Soạn, xem trước và xuất Markdown. Bản nháp chỉ được lưu trên thiết bị này; đưa tệp vào thư mục nội dung để Vercel xuất bản.</p></header>
      <div className="studio-grid">
        <div className="studio-editor">
          <div className="studio-bar"><span>DRAFT.MD</span><i>{saved ? "ĐÃ LƯU" : "CHƯA LƯU"}</i></div>
          <label><span>TIÊU ĐỀ</span><input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="Một tiêu đề khiến người đọc dừng lại" /></label>
          <div className="studio-fields"><label><span>CHỦ ĐỀ</span><select value={draft.category} onChange={(event) => update("category", event.target.value)}><option>Góc nhìn</option><option>ERPNext</option><option>Automation</option><option>1nguoi.com</option></select></label><label><span>MÔ TẢ NGẮN</span><input value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} placeholder="Một câu tóm tắt" /></label></div>
          <label><span>NỘI DUNG MARKDOWN</span><textarea value={draft.body} onChange={(event) => update("body", event.target.value)} placeholder={"## Điều tôi nhận ra\n\nBắt đầu viết từ một việc thật..."} /></label>
          <div className="studio-actions"><button type="button" onClick={save}>LƯU BẢN NHÁP</button><button type="button" onClick={exportMarkdown} disabled={!draft.title.trim()}>XUẤT MARKDOWN ↗</button></div>
        </div>
        <article className="studio-preview">
          <div className="studio-bar"><span>LIVE PREVIEW</span><i>VIEW</i></div>
          <span>{draft.category || "CHỦ ĐỀ"} • BẢN NHÁP</span>
          <h2>{draft.title || "Tiêu đề sẽ xuất hiện ở đây."}</h2>
          <p className="preview-excerpt">{draft.excerpt || "Mô tả ngắn giúp người đọc biết vì sao bài viết này đáng thời gian của họ."}</p>
          <div className="preview-body">{draft.body ? draft.body.split("\n").map((line, index) => line.startsWith("## ") ? <h3 key={index}>{line.slice(3)}</h3> : line ? <p key={index}>{line}</p> : <br key={index} />) : <p>Bắt đầu viết ở khung bên trái. Bản xem trước cập nhật ngay khi A9 gõ.</p>}</div>
        </article>
      </div>
    </section>
  );
}
