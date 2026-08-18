export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
};

export type Post = {
  slug: string;
  number: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  accent: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "them-mot-cot-thoi-ma",
    number: "001",
    title: "Thêm một cột thôi mà!",
    excerpt: "Một thay đổi nhỏ trong nghiệp vụ có thể mất vài tuần — hoặc hai phút. Khác biệt nằm ở kiến trúc hệ thống.",
    category: "ERPNext",
    date: "18.08.2026",
    readTime: "7 phút",
    accent: "acid",
    sections: [
      {
        paragraphs: [
          "Một nhân viên giao hàng cần thêm trường “Biển số xe” vào phiếu. Với phần mềm đóng gói, quy trình quen thuộc là gửi yêu cầu, chờ khảo sát, nhận báo giá rồi chờ triển khai.",
          "Với ERPNext, một key user có thể mở Customize Form, kéo trường dữ liệu vào đúng vị trí và hoàn tất trong vài phút — không cần viết mã.",
        ],
      },
      {
        heading: "Điều đáng nói không phải là hai phút",
        paragraphs: [
          "Giá trị thật nằm ở khoảng cách rất ngắn giữa một ý tưởng vận hành và lúc hệ thống bắt đầu chạy theo ý tưởng đó.",
          "Doanh nghiệp luôn thay đổi. Nếu mỗi thay đổi đều phải xếp hàng chờ nhà cung cấp, phần mềm sẽ dần trở thành điểm nghẽn.",
        ],
        quote: "Khả năng thay đổi mới là tính năng đắt giá nhất của một hệ thống ERP.",
      },
      {
        heading: "Sáu nấc tùy biến",
        bullets: [
          "Cấu hình — đổi quy tắc mà không chạm vào mã.",
          "Customize Form — thêm, ẩn, sắp xếp trường dữ liệu.",
          "Workflow & Rule — tự động hóa phê duyệt và nhắc việc.",
          "Script — đưa logic đặc thù vào đúng điểm cần thiết.",
          "Custom App — xây nghiệp vụ riêng nhưng vẫn đứng trên nền tảng chung.",
          "API & Integration — nối ERP với website, BI, n8n và AI.",
        ],
      },
    ],
  },
  {
    slug: "erp-khong-nen-la-phanh-tay",
    number: "002",
    title: "ERP không nên là phanh tay của doanh nghiệp",
    excerpt: "Đừng chỉ hỏi ERP có bao nhiêu chức năng. Hãy hỏi mất bao lâu để biến một nghiệp vụ mới thành phần mềm.",
    category: "Góc nhìn",
    date: "12.08.2026",
    readTime: "9 phút",
    accent: "orange",
    sections: [
      {
        paragraphs: [
          "Nhiều doanh nghiệp mua ERP với một mục tiêu rất đơn giản: quản lý tốt hơn. Nhưng vài năm sau, chính ERP lại khiến doanh nghiệp thay đổi chậm hơn.",
          "Muốn thêm quy trình mới thì chờ vendor. Muốn kết nối hệ thống khác thì mở một dự án tích hợp. Muốn đổi đơn vị triển khai thì bắt đầu thấy đau đầu.",
        ],
      },
      {
        heading: "Doanh nghiệp tăng trưởng chắc chắn sẽ thay đổi",
        paragraphs: [
          "Kênh bán, chính sách giá, luồng duyệt, cách tính thưởng, dữ liệu khách hàng — tất cả đều thay đổi theo thời gian.",
          "Một ERP tốt không chỉ ghi nhận hiện tại. Nó phải tạo đủ không gian cho mô hình vận hành tiếp theo.",
        ],
        quote: "Đừng tổ chức doanh nghiệp quanh giới hạn của phần mềm.",
      },
      {
        heading: "Từ sản phẩm đóng gói tới nền tảng vận hành",
        bullets: [
          "Dữ liệu có thể tự quản lý.",
          "Quy trình có thể tự điều chỉnh.",
          "API đủ mở để kết nối hệ sinh thái mới.",
          "Đội ngũ nội bộ giữ được quyền chủ động.",
        ],
      },
    ],
  },
  {
    slug: "phong-it-mot-nguoi",
    number: "003",
    title: "Phòng IT một người trong nhà máy 30 năm",
    excerpt: "Không phải làm tất cả một mình. Là thiết kế hệ thống để máy móc, dữ liệu và AI cùng làm việc.",
    category: "1nguoi.com",
    date: "06.08.2026",
    readTime: "6 phút",
    accent: "cyan",
    sections: [
      {
        paragraphs: [
          "Một nhà máy thực phẩm lâu năm có kế toán, kho, mua hàng, bán hàng, sản xuất, chấm công và rất nhiều ngoại lệ nghiệp vụ.",
          "Khi chỉ có một người giữ vai trò kết nối vận hành với công nghệ, ưu tiên không thể là viết mọi thứ từ đầu. Ưu tiên phải là chọn đúng nền tảng, chuẩn hóa dữ liệu và tự động hóa phần lặp lại.",
        ],
      },
      {
        heading: "Một người không có nghĩa là đơn độc",
        paragraphs: [
          "ERPNext giữ dữ liệu lõi. n8n nối các luồng. BI biến dữ liệu thành tín hiệu. AI hỗ trợ đọc tài liệu, tạo mã và kiểm tra giả thuyết.",
          "Vai trò của con người chuyển từ làm từng thao tác sang thiết kế cách các bộ phận phối hợp với nhau.",
        ],
      },
      {
        heading: "Ba nguyên tắc tôi đang theo đuổi",
        bullets: [
          "Nền tảng mở trước, tùy biến sau.",
          "Đo được trước khi tối ưu.",
          "Tự động hóa để con người làm phần cần phán đoán.",
        ],
      },
    ],
  },
  {
    slug: "tu-po-den-chung-tu",
    number: "004",
    title: "Từ PO siêu thị đến chứng từ trong vài phút",
    excerpt: "Một thử nghiệm nhỏ với AI, ERPNext và dữ liệu có cấu trúc đã loại bỏ chuỗi nhập liệu lặp đi lặp lại.",
    category: "Automation",
    date: "31.07.2026",
    readTime: "5 phút",
    accent: "violet",
    sections: [
      {
        paragraphs: [
          "PO từ siêu thị thường đến dưới nhiều định dạng. Nhân sự phải đọc mã hàng, barcode, số lượng và đơn vị quy đổi rồi nhập lại vào hệ thống.",
          "Tôi thử tách quy trình thành ba lớp: AI đọc tài liệu, một lớp kiểm tra chuẩn hóa dữ liệu, ERPNext nhận dữ liệu đã có cấu trúc để tạo chứng từ.",
        ],
      },
      {
        heading: "Tự động hóa không bắt đầu bằng AI",
        paragraphs: [
          "Nó bắt đầu bằng việc hiểu rõ đầu vào, đầu ra, quy tắc kiểm tra và điểm nào con người cần xác nhận.",
          "AI chỉ thực sự hữu ích khi được đặt trong một quy trình có ranh giới và khả năng truy vết.",
        ],
        quote: "Đừng tự động hóa sự mơ hồ. Hãy làm rõ quy trình trước.",
      },
    ],
  },
];

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: "Dùng ngay" | "Đang phát triển";
  symbol: string;
  accent: string;
};

export const toolsDirectory: Tool[] = [
  {
    slug: "erp-readiness",
    title: "ERP Readiness Scan",
    description: "Bài kiểm tra nhanh giúp nhìn ra doanh nghiệp đang thiếu quy trình, dữ liệu hay năng lực triển khai.",
    category: "Đánh giá",
    status: "Dùng ngay",
    symbol: "◎",
    accent: "acid",
  },
  {
    slug: "customization-ladder",
    title: "6 nấc tùy biến ERP",
    description: "Chọn đúng cấp độ từ cấu hình không code tới custom app và tích hợp API.",
    category: "ERPNext",
    status: "Dùng ngay",
    symbol: "↗",
    accent: "cyan",
  },
  {
    slug: "automation-checklist",
    title: "Automation Canvas",
    description: "Khung phân tích một quy trình trước khi đưa n8n hoặc AI vào tự động hóa.",
    category: "Tự động hóa",
    status: "Đang phát triển",
    symbol: "⌁",
    accent: "orange",
  },
  {
    slug: "open-stack",
    title: "Open Operations Stack",
    description: "Bản đồ các công cụ mã nguồn mở cho ERP, workflow, BI, tài liệu và AI nội bộ.",
    category: "Tài nguyên",
    status: "Đang phát triển",
    symbol: "✣",
    accent: "violet",
  },
];
