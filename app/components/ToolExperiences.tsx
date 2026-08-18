"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const readinessQuestions = [
  { title: "Quy trình cốt lõi đã được mô tả rõ?", detail: "Bán hàng, mua hàng, kho, kế toán và sản xuất có cùng cách hiểu về trạng thái hoàn tất." },
  { title: "Dữ liệu danh mục đã có một chuẩn chung?", detail: "Mã hàng, khách hàng, nhà cung cấp, đơn vị tính không bị trùng hoặc đặt tùy ý." },
  { title: "Có người sở hữu từng quy trình?", detail: "Mỗi luồng nghiệp vụ có một người đủ thẩm quyền quyết định cách làm chuẩn." },
  { title: "Ban lãnh đạo dành thời gian cho dự án?", detail: "ERP được xem là dự án thay đổi vận hành, không phải riêng việc của IT hoặc kế toán." },
  { title: "Đội ngũ sẵn sàng thay đổi thói quen?", detail: "Người dùng hiểu lý do thay đổi và có thời gian học, thử, phản hồi." },
  { title: "Có tiêu chí đo sau triển khai?", detail: "Thời gian xử lý, độ chính xác tồn kho, công nợ hoặc tỷ lệ thao tác tự động được theo dõi." },
];

const levels = [
  { n: "01", title: "Cấu hình", who: "Người dùng chịu khó tìm hiểu", code: "0 dòng", time: "Vài phút", example: "Đổi quy tắc đánh số, bật quản lý lô, thiết lập ngày công chuẩn.", color: "#d9ff4f" },
  { n: "02", title: "Customize Form", who: "Key user", code: "0 dòng", time: "5 phút", example: "Thêm trường Biển số xe, ẩn trường thừa, sắp xếp lại form.", color: "#78e5e7" },
  { n: "03", title: "Workflow & Rule", who: "Admin hệ thống", code: "0 dòng", time: "30 phút", example: "Đơn lớn tự trình duyệt, phiếu treo quá hạn tự nhắc.", color: "#84dba3" },
  { n: "04", title: "Script", who: "Dev hoặc power user", code: "JavaScript / Python", time: "Vài giờ", example: "Chặn khách nợ quá hạn, tính chiết khấu bậc thang.", color: "#ffb85c" },
  { n: "05", title: "Custom App", who: "Developer", code: "Frappe app", time: "Ngày → tuần", example: "Xây một nghiệp vụ đặc thù có vòng đời và quyền riêng.", color: "#ff8058" },
  { n: "06", title: "API & Integration", who: "Đội tích hợp", code: "API / Webhook", time: "Tùy phạm vi", example: "Nối website, n8n, BI, thiết bị và AI vào ERP.", color: "#b7a3ff" },
];

export function ErpReadiness() {
  const [answers, setAnswers] = useState<number[]>(Array(readinessQuestions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const completed = answers.filter((answer) => answer >= 0).length;
  const score = Math.round((answers.reduce((sum, answer) => sum + Math.max(0, answer), 0) / (readinessQuestions.length * 2)) * 100);
  const verdict = score >= 75 ? "Sẵn sàng để thiết kế lộ trình" : score >= 45 ? "Có nền tảng, cần gia cố trước" : "Chưa nên vội mua phần mềm";
  const recommendation = score >= 75
    ? "Hãy bắt đầu bằng phạm vi nhỏ, chỉ số đo rõ và đội key user có quyền quyết định."
    : score >= 45
      ? "Ưu tiên chuẩn hóa danh mục, chọn process owner và thống nhất cách đo trước khi chọn giải pháp."
      : "Dành 4–6 tuần để mô tả quy trình, làm sạch dữ liệu và thống nhất trách nhiệm. Phần mềm nên đến sau.";

  const choose = (questionIndex: number, value: number) => {
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? value : answer));
    setShowResult(false);
  };

  return (
    <section className="interactive-tool">
      <div className="interactive-tool-head">
        <Link href="/tools">← KHO CÔNG CỤ</Link>
        <span>TOOL 01 / ASSESSMENT</span>
        <h1>ERP Readiness<br /><em>Scan.</em></h1>
        <p>Sáu câu hỏi để phân biệt “cần ERP” với “đã sẵn sàng triển khai ERP”. Kết quả chỉ là gợi ý định hướng, không thay thế khảo sát thực tế.</p>
      </div>

      {!showResult ? (
        <div className="readiness-panel">
          <div className="readiness-progress"><span style={{ width: `${(completed / readinessQuestions.length) * 100}%` }} /><i>{completed}/{readinessQuestions.length}</i></div>
          {readinessQuestions.map((question, index) => (
            <div className="readiness-question" key={question.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{question.title}</h2><p>{question.detail}</p></div>
              <div className="answer-options">
                {[{ label: "Chưa", value: 0 }, { label: "Một phần", value: 1 }, { label: "Rõ", value: 2 }].map((option) => (
                  <button className={answers[index] === option.value ? "is-selected" : ""} type="button" key={option.value} onClick={() => choose(index, option.value)}>{option.label}</button>
                ))}
              </div>
            </div>
          ))}
          <button className="result-button" type="button" disabled={completed !== readinessQuestions.length} onClick={() => setShowResult(true)}>XEM KẾT QUẢ <span>↗</span></button>
        </div>
      ) : (
        <div className="readiness-result">
          <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}</span><i>/100</i></div>
          <div><span>ĐÁNH GIÁ HIỆN TẠI</span><h2>{verdict}</h2><p>{recommendation}</p><button type="button" onClick={() => setShowResult(false)}>XEM LẠI CÂU TRẢ LỜI</button></div>
        </div>
      )}
    </section>
  );
}

export function CustomizationLadder() {
  const [active, setActive] = useState(1);
  const level = levels[active];
  const progress = useMemo(() => ((active + 1) / levels.length) * 100, [active]);
  return (
    <section className="interactive-tool ladder-tool">
      <div className="interactive-tool-head">
        <Link href="/tools">← KHO CÔNG CỤ</Link>
        <span>TOOL 02 / ERPNext</span>
        <h1>6 nấc<br /><em>tùy biến.</em></h1>
        <p>Chọn nấc thấp nhất có thể giải quyết đúng bài toán. Tùy biến tốt không phải là viết nhiều mã hơn.</p>
      </div>
      <div className="ladder-stage">
        <div className="ladder-steps">
          {levels.map((item, index) => (
            <button className={index === active ? "is-active" : ""} style={{ "--level-color": item.color } as React.CSSProperties} type="button" key={item.n} onClick={() => setActive(index)}>
              <span>{item.n}</span><b>{item.title}</b><i>{item.code}</i>
            </button>
          ))}
          <div className="ladder-progress"><span style={{ height: `${progress}%` }} /></div>
        </div>
        <div className="level-detail" style={{ "--level-color": level.color } as React.CSSProperties}>
          <div className="level-number">{level.n}</div>
          <span>CẤP ĐỘ ĐANG CHỌN</span>
          <h2>{level.title}</h2>
          <div className="level-stats"><div><span>AI LÀM ĐƯỢC</span><b>{level.who}</b></div><div><span>MÃ NGUỒN</span><b>{level.code}</b></div><div><span>THỜI GIAN</span><b>{level.time}</b></div></div>
          <p><span>VÍ DỤ</span>{level.example}</p>
          <div className="level-advice">Nguyên tắc: bắt đầu ở nấc 1. Chỉ đi lên khi giới hạn của nấc hiện tại đã được chứng minh.</div>
        </div>
      </div>
    </section>
  );
}
