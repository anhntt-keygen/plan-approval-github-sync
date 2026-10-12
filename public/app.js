/**
 * [TASK-04] Xử lý logic Frontend kết nối API, duyệt kế hoạch và đồng bộ GitHub
 */
document.addEventListener('DOMContentLoaded', () => {
    const planForm = document.getElementById('planForm');
    const plansContainer = document.getElementById('plansContainer');
    const btnRefresh = document.getElementById('btnRefresh');

    const API_URL = '/api/plans';

    // Hàm lấy danh sách kế hoạch từ API và hiển thị lên giao diện
    async function fetchPlans() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Không thể tải danh sách kế hoạch.');
            const plans = await response.json();
            renderPlans(plans);
        } catch (error) {
            console.error(error);
            plansContainer.innerHTML = `<div class="error">Lỗi kết nối API: ${error.message}</div>`;
        }
    }

    // Hàm render danh sách kế hoạch ra HTML
    function renderPlans(plans) {
        if (plans.length === 0) {
            plansContainer.innerHTML = '<div class="no-data">Chưa có kế hoạch nào được tạo.</div>';
            return;
        }

        plansContainer.innerHTML = plans.map(plan => {
            const statusClass = `status-${plan.status.toLowerCase()}`;
            
            // Tạo danh sách Task HTML
            const tasksHtml = plan.tasks.map(task => `<li>${task}</li>`).join('');
            
            // Tạo danh sách Logs HTML
            const logsHtml = plan.logs.map(log => `> ${log}`).join('\n');

            // Xác định trạng thái nút bấm
            let actionButtons = '';
            if (plan.status === 'Draft') {
                actionButtons = `
                    <button class="btn btn-primary btn-approve" data-id="${plan.id}">✔️ Phê Duyệt</button>
                `;
            } else if (plan.status === 'Approved') {
                actionButtons = `
                    <button class="btn btn-success btn-sync" data-id="${plan.id}">🐙 Đẩy GitHub</button>
                `;
            } else {
                actionButtons = `
                    <button class="btn btn-secondary" disabled style="width: 100%;">✅ Đã Đồng Bộ GitHub</button>
                `;
            }

            return `
                <div class="plan-card ${statusClass}" data-plan-id="${plan.id}">
                    <div class="plan-header">
                        <span class="plan-id">${plan.id} | Scenario: ${plan.scenario}</span>
                        <span class="status-badge">${plan.status}</span>
                    </div>
                    <h3 class="plan-title">${plan.title}</h3>
                    <div class="plan-meta">
                        <strong>Repo:</strong> <a href="${plan.githubRepo}" target="_blank">${plan.githubRepo}</a>
                    </div>
                    <div class="tasks-container">
                        <strong>Danh sách Tasks:</strong>
                        <ul class="task-list">
                            ${tasksHtml}
                        </ul>
                    </div>
                    <div class="logs-container">
                        <strong>Nhật ký hoạt động:</strong>
                        <pre class="log-box">${logsHtml}</pre>
                    </div>
                    <div class="plan-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join('');

        // Gắn sự kiện cho các nút Phê duyệt
        document.querySelectorAll('.btn-approve').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                approvePlan(id);
            });
        });

        // Gắn sự kiện cho các nút Đồng bộ GitHub
        document.querySelectorAll('.btn-sync').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                syncGitHub(id);
            });
        });
    }

    // Xử lý gửi form tạo kế hoạch mới
    planForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const scenario = document.getElementById('scenario').value;
        const githubRepo = document.getElementById('githubRepo').value;
        const tasks = document.getElementById('tasks').value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, scenario, githubRepo, tasks })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Lỗi khi tạo kế hoạch.');
            }

            // Reset form và tải lại danh sách
            planForm.reset();
            fetchPlans();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    });

    // Hàm gọi API phê duyệt kế hoạch
    async function approvePlan(id) {
        try {
            const response = await fetch(`${API_URL}/${id}/approve`, {
                method: 'PUT'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Lỗi khi phê duyệt.');
            }

            fetchPlans();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }

    // Hàm gọi API đồng bộ GitHub
    async function syncGitHub(id) {
        try {
            const response = await fetch(`${API_URL}/${id}/sync-github`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Lỗi khi đồng bộ GitHub.');
            }

            fetchPlans();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    }

    // Sự kiện nút làm mới danh sách
    btnRefresh.addEventListener('click', fetchPlans);

    // Tải danh sách kế hoạch lần đầu khi mở trang
    fetchPlans();
});
```

---