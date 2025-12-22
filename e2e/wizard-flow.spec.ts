import { test, expect } from '@playwright/test';

test.describe('Wizard Flow', () => {
  test('should complete full wizard journey', async ({ page }) => {
    await page.goto('/');

    // Step 1: Rate 2025 Life Wheel
    await expect(page.getByText(/评价你的 2025|Rate Your 2025/i)).toBeVisible();

    // Interact with life wheel (click on a dimension)
    const bodySection = page.locator('svg path').first();
    await bodySection.click();

    // Navigate to Step 2
    const nextButton = page.getByRole('button', { name: /下一步|Next/i });
    await nextButton.click();

    // Step 2: Reflections
    await expect(page.locator('[class*="step"]')).toContainText('2');

    // Fill in reflection
    await page.locator('textarea').first().fill('My key achievements this year');
    await nextButton.click();

    // Step 3: Select keyword
    await expect(page.locator('[class*="step"]')).toContainText('3');

    // Click a keyword
    await page.locator('[class*="keyword"]').first().click();
    await nextButton.click();

    // Step 4: Rate 2026 Goals
    await expect(page.locator('[class*="step"]')).toContainText('4');

    // Should show 2026 wheel
    await expect(page.getByText(/2026/i)).toBeVisible();
    await nextButton.click();

    // Step 5: Focus Areas & Actions
    await expect(page.locator('[class*="step"]')).toContainText('5');
    await nextButton.click();

    // Step 6: 2026 Keyword
    await expect(page.locator('[class*="step"]')).toContainText('6');
    await page.locator('[class*="keyword"]').first().click();
    await nextButton.click();

    // Step 7: Final Summary
    await expect(page.locator('[class*="step"]')).toContainText('7');

    // Should show both 2025 and 2026 data
    await expect(page.getByText(/2025|2026/i)).toBeVisible();
  });

  test('should allow navigation to previous steps', async ({ page }) => {
    await page.goto('/');

    // Go to step 2
    await page.getByRole('button', { name: /下一步|Next/i }).click();
    await expect(page.locator('[class*="step"]')).toContainText('2');

    // Go to step 3
    await page.getByRole('button', { name: /下一步|Next/i }).click();
    await expect(page.locator('[class*="step"]')).toContainText('3');

    // Click step 1 in progress indicator
    await page.locator('button').filter({ hasText: '1' }).click();

    // Should be back at step 1
    await expect(page.getByText(/评价你的 2025|Rate Your 2025/i)).toBeVisible();
  });

  test('should save progress to localStorage', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();

    // Fill some data
    await page.getByRole('button', { name: /Next/i }).click();
    await page.locator('textarea').first().fill('Test reflection');

    // Reload page
    await page.reload();

    // Data should persist
    await expect(page.locator('textarea').first()).toHaveValue('Test reflection');
    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible(); // Language persisted
  });

  test('should download and upload data', async ({ page }) => {
    await page.goto('/');

    // Click download button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /下载|Download/i }).click();
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/tide-planner-.*\.json/);

    // Upload the same file
    const fileInput = page.locator('input[type="file"]');
    await page.getByRole('button', { name: /上传|Upload/i }).click();

    // Note: Actual file upload testing would require the downloaded file
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
