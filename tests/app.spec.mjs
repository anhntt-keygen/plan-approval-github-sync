import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Hệ Thống Quản Lý, Duyệt Kế Hoạch & Đồng Bộ GitHub', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập ứng dụng trước mỗi test case
    await page.goto(BASE_URL);
  });

  test('Hiển thị danh sách kế hoạch mặc định', async ({ page }) => {
    // Kiểm tra tiêu đề trang
    await expect(page).toHaveTitle(/Hệ Thống Duyệt Kế Hoạch & Đồng Bộ GitHub/);

    // Kiểm tra sự tồn tại của các kế hoạch mặc định (PLAN-001, PLAN-002)
    const plan1 = page.locator('[data-plan-id="PLAN-001"]');
    const plan2 = page.locator('[data-plan-id="PLAN-002"]');

    await expect(plan1).toBeVisible();
    await expect(plan2).toBeVisible();

    // Kiểm tra trạng thái ban đầu của các kế hoạch mặc định
    await expect(plan1.locator('.status-badge')).toHaveText('Draft');
    await expect(plan2.locator('.status-badge')).toHaveText('Approved');
  });

  test('Tạo mới một kế hoạch thành công ở trạng thái Draft', async ({ page }) => {
    // Điền thông tin vào form
    await page.fill('#title', 'Kiểm thử Tự động hóa Playwright');
    await page.fill('#scenario', 'SC-99');
    await page.fill('#githubRepo', 'https://github.com/vibecode/playwright-test');
    await page.fill('#tasks', '[TASK-99] Viết kịch bản test, [TASK-100] Chạy CI/CD');

    // Submit form
    await page.click('#btnSubmit');

    // Chờ kế hoạch mới xuất hiện trên giao diện
    const newPlanCard = page.locator('.plan-card').filter({ hasText: 'Kiểm thử Tự động hóa Playwright' });
    await expect(newPlanCard).toBeVisible();

    // Xác nhận trạng thái mặc định là Draft
    await expect(newPlanCard.locator('.status-badge')).toHaveText('Draft');
  });

  test('Phê duyệt kế hoạch thành công (Draft -> Approved)', async ({ page }) => {
    const plan1 = page.locator('[data-plan-id="PLAN-001"]');
    
    // Đảm bảo trạng thái ban đầu là Draft
    await expect(plan1.locator('.status-badge')).toHaveText('Draft');

    // Click nút Phê Duyệt
    const approveBtn = plan1.locator('.btn-approve');
    await approveBtn.click();

    // Trạng thái cập nhật thành Approved
    await expect(plan1.locator('.status-badge')).toHaveText('Approved');
    
    // Nút chuyển đổi sang Đẩy GitHub
    await expect(plan1.locator('.btn-sync')).toBeVisible();
  });

  test('Đồng bộ GitHub thành công (Approved -> Synced)', async ({ page }) => {
    const plan2 = page.locator('[data-plan-id="PLAN-002"]');

    // Đảm bảo trạng thái ban đầu là Approved
    await expect(plan2.locator('.status-badge')).toHaveText('Approved');

    // Click nút Đẩy GitHub
    const syncBtn = plan2.locator('.btn-sync');
    await syncBtn.click();

    // Trạng thái cập nhật thành Synced
    await expect(plan2.locator('.status-badge')).toHaveText('Synced');

    // Nút hành động bị vô hiệu hóa (Đã Đồng Bộ GitHub)
    const disabledBtn = plan2.locator('.plan-actions button');
    await expect(disabledBtn).toBeDisabled();
    await expect(disabledBtn).toHaveText(/Đã Đồng Bộ GitHub/);
  });
});