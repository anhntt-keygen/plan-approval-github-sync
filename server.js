/**
 * [TASK-02] Xây dựng RESTful API Backend quản lý kế hoạch và đồng bộ GitHub
 * Đã khắc phục triệt để lỗi Race Condition bằng cách cập nhật trạng thái đồng bộ trước khi phản hồi.
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cơ sở dữ liệu tạm thời trong bộ nhớ (In-memory Database)
let plans = [
  {
    id: "PLAN-001",
    title: "Phát triển Module Xác thực Người dùng",
    scenario: "SC-01",
    tasks: ["[TASK-01] Thiết lập DB", "[TASK-02] Viết API Đăng nhập", "[TASK-03] Thiết kế UI Login"],
    status: "Draft", // Draft -> Approved -> Synced
    githubRepo: "https://github.com/vibecode/auth-module",
    logs: ["Kế hoạch được tạo ở trạng thái Nháp."]
  },
  {
    id: "PLAN-002",
    title: "Tích hợp Cổng Thanh toán Quốc tế",
    scenario: "SC-02",
    tasks: ["[TASK-04] Kết nối Stripe API", "[TASK-05] Xử lý Webhook"],
    status: "Approved",
    githubRepo: "https://github.com/vibecode/payment-gateway",
    logs: ["Kế hoạch được tạo.", "Đã phê duyệt kế hoạch bởi Admin."]
  }
];

// Lấy danh sách tất cả kế hoạch
app.get('/api/plans', (req, res) => {
  res.status(200).json(plans);
});

// Tạo mới một kế hoạch
app.post('/api/plans', (req, res) => {
  const { title, scenario, tasks, githubRepo } = req.body;

  if (!title || !scenario || !tasks || !githubRepo) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
  }

  const taskArray = typeof tasks === 'string' 
    ? tasks.split(',').map(t => t.trim()).filter(t => t.length > 0)
    : tasks;

  const newPlan = {
    id: `PLAN-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    scenario,
    tasks: taskArray,
    status: "Draft",
    githubRepo,
    logs: [`Kế hoạch được khởi tạo thành công lúc ${new Date().toLocaleTimeString()}`]
  };

  plans.push(newPlan);
  res.status(201).json(newPlan);
});

// Phê duyệt kế hoạch (Draft -> Approved)
app.put('/api/plans/:id/approve', (req, res) => {
  const { id } = req.params;
  const plan = plans.find(p => p.id === id);

  if (!plan) {
    return res.status(404).json({ message: "Không tìm thấy kế hoạch yêu cầu." });
  }

  if (plan.status !== 'Draft') {
    return res.status(400).json({ message: "Chỉ có thể phê duyệt kế hoạch đang ở trạng thái Nháp (Draft)." });
  }

  plan.status = 'Approved';
  plan.logs.push(`Đã phê duyệt kế hoạch lúc ${new Date().toLocaleTimeString()}`);
  
  res.status(200).json(plan);
});

// Đồng bộ đẩy mã nguồn lên GitHub Mock (Approved -> Synced)
app.post('/api/plans/:id/sync-github', (req, res) => {
  const { id } = req.params;
  const plan = plans.find(p => p.id === id);

  if (!plan) {
    return res.status(404).json({ message: "Không tìm thấy kế hoạch yêu cầu." });
  }

  if (plan.status !== 'Approved') {
    return res.status(400).json({ message: "Chỉ có thể đồng bộ GitHub sau khi kế hoạch đã được Phê duyệt (Approved)." });
  }

  // Cập nhật trạng thái đồng bộ ngay lập tức để tránh Race Condition trên UI
  plan.status = 'Synced';
  plan.logs.push(`Bắt đầu tiến trình đóng gói mã nguồn cho các Task: ${plan.tasks.join(', ')}`);
  plan.logs.push(`Đang kết nối tới kho lưu trữ: ${plan.githubRepo}...`);
  plan.logs.push(`[GitHub Sync] Đã push thành công commit "Feat: Hoàn thành các task thuộc ${plan.id}" lên nhánh main.`);
  plan.logs.push(`Đồng bộ hoàn tất lúc ${new Date().toLocaleTimeString()}`);

  res.status(200).json({
    message: "Đồng bộ GitHub thành công.",
    plan: plan
  });
});

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
```

---