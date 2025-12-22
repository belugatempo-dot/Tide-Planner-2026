import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should default to Chinese', async ({ page }) => {
    await page.goto('/');

    // Check for Chinese text
    await expect(page.getByText('2025回顾 & 2026规划')).toBeVisible();
    await expect(page.getByText('在2026年成为最好的自己')).toBeVisible();
  });

  test('should switch to English and update URL', async ({ page }) => {
    await page.goto('/');

    // Click EN button
    await page.getByRole('button', { name: 'EN' }).click();

    // Check English text appears
    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible();
    await expect(page.getByText('Be your best self in 2026')).toBeVisible();

    // Check URL updated
    await expect(page).toHaveURL(/lang=en/);
  });

  test('should switch back to Chinese and update URL', async ({ page }) => {
    await page.goto('/?lang=en');

    // Click 中文 button
    await page.getByRole('button', { name: '中文' }).click();

    // Check Chinese text appears
    await expect(page.getByText('2025回顾 & 2026规划')).toBeVisible();

    // Check URL updated
    await expect(page).toHaveURL(/lang=zh/);
  });

  test('should respect lang=en URL parameter', async ({ page }) => {
    await page.goto('/?lang=en');

    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'EN' })).toHaveClass(/bg-\[var\(--accent\)\]/);
  });

  test('should respect lang=zh URL parameter', async ({ page }) => {
    await page.goto('/?lang=zh');

    await expect(page.getByText('2025回顾 & 2026规划')).toBeVisible();
    await expect(page.getByRole('button', { name: '中文' })).toHaveClass(/bg-\[var\(--accent\)\]/);
  });

  test('should persist language across page reloads', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveURL(/lang=en/);

    // Reload page
    await page.reload();

    // Should still be in English
    await expect(page.getByText('2025 Reflection & 2026 Planning')).toBeVisible();
  });
});
