import { test, expect } from '@playwright/test';

test.describe('Wizard Flow', () => {
  test('should complete full wizard journey', async ({ page }) => {
    await page.goto('/');

    // Step 1: Rate 2025 Life Wheel
    await expect(page.getByText(/评估你的 2025|Rate Your 2025/i)).toBeVisible();

    // Interact with life wheel (click on a dimension) - use force to click through overlay
    const bodySection = page.locator('svg path').first();
    await bodySection.click({ force: true });

    // Navigate to Step 2 - find the current active step indicator (with accent bg)
    const nextButton = page.getByRole('button', { name: /下一步|Next/i });
    await nextButton.click();

    // Step 2: Reflections - verify step 2 content is visible
    await expect(page.getByText(/反思 2025|Reflect on 2025/i)).toBeVisible();

    // Fill in reflection
    await page.locator('textarea').first().fill('My key achievements this year');
    await nextButton.click();

    // Step 3: Select keyword - check for keyword selection UI
    await expect(page.getByText(/2025 关键词|2025 Keyword/i)).toBeVisible();

    // Click one of the recommended keyword buttons (they have emojis and text)
    const keywordButtons = page.locator('button').filter({ has: page.locator('text=/Growth|成长|Learning|学习|Balance|平衡|Courage|勇气/i') });
    await keywordButtons.first().click();
    await nextButton.click();

    // Step 4: Rate 2026 Goals - check for step-specific heading
    await expect(page.getByText(/规划你的 2026|Design Your 2026/i)).toBeVisible();
    await nextButton.click();

    // Step 5: Focus Areas & Actions - check for step heading
    await expect(page.getByRole('heading', { name: /行动规划|Action Plan/i })).toBeVisible();
    await nextButton.click();

    // Step 6: 2026 Keyword - auto-spins and reveals keyword
    await expect(page.getByText(/2026.*关键词|2026.*keyword/i)).toBeVisible();
    // Wait for the auto-spin to complete (reveals keyword after ~2 seconds)
    await expect(page.getByText(/你的关键词是|Your word is/i)).toBeVisible({ timeout: 5000 });
    // The "See My Plan" button should now be enabled
    await page.getByRole('button', { name: /查看我的计划|See My Plan/i }).click();

    // Step 7: Final Summary - should show tabs for 2025/2026 review
    await expect(page.getByText(/2025 回顾|2025 Review/i)).toBeVisible();
    await expect(page.getByText(/2026 目标|2026 Goals/i)).toBeVisible();
  });

  test('should allow navigation to previous steps', async ({ page }) => {
    await page.goto('/');

    // Go to step 2
    await page.getByRole('button', { name: /下一步|Next/i }).click();
    await expect(page.getByText(/反思 2025|Reflect on 2025/i)).toBeVisible();

    // Go to step 3
    await page.getByRole('button', { name: /下一步|Next/i }).click();
    await expect(page.getByText(/2025 关键词|2025 Keyword/i)).toBeVisible();

    // Click step 1 in progress indicator (button with just "1")
    await page.locator('button').filter({ hasText: /^1$/ }).click();

    // Should be back at step 1
    await expect(page.getByText(/评估你的 2025|Rate Your 2025/i)).toBeVisible();
  });

  test('should save progress to localStorage', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();

    // Wait for English content
    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible();

    // Fill some data - go to step 2
    await page.getByRole('button', { name: /Next/i }).click();

    // Wait for step 2 to load
    await expect(page.getByText(/Reflect on 2025/i)).toBeVisible();

    await page.locator('textarea').first().fill('Test reflection');

    // Wait for debounced save (200ms in the app)
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Wait for page to fully load - should restore to step 2 with the data
    await expect(page.getByText(/Reflect on 2025/i)).toBeVisible();
    await expect(page.locator('textarea').first()).toHaveValue('Test reflection');
    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible();
  });

  test('should download and upload data', async ({ page }) => {
    await page.goto('/');

    // Click download button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /下载|Download/i }).click();
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/tide-planner-.*\.json/);

    // Upload button should be visible
    await expect(page.getByRole('button', { name: /上传|Upload/i })).toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/');

    // Language switcher should be visible
    await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
    await expect(page.getByRole('button', { name: '中文' })).toBeVisible();

    // Life wheel should be visible and scrollable
    await expect(page.locator('svg')).toBeVisible();

    // Navigation buttons should be accessible
    await expect(page.getByRole('button', { name: /下一步|Next/i })).toBeVisible();
  });
});
