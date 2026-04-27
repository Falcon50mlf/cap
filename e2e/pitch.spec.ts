import { expect, test } from '@playwright/test';

test.describe('Pitch deck navigation', () => {
  test('/pitch loads and shows slide 01', async ({ page }) => {
    await page.goto('/pitch');

    // Slide 01 — Hook
    await expect(page.locator('text=1 600 000').first()).toBeVisible();
    await expect(page.locator('text=lycéens').first()).toBeVisible();

    // Counter "01 / 10"
    await expect(page.locator('text=/01.*\\/.*10/').first()).toBeVisible();
  });

  test('arrow right advances to slide 2', async ({ page }) => {
    await page.goto('/pitch');
    await page.keyboard.press('ArrowRight');

    // Slide 02 = "Pourquoi nous ?" (équipe — réordonnée à slot 02)
    await expect(page.locator('text=Pourquoi nous').first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=/02.*\\/.*10/').first()).toBeVisible();
  });

  test('hash deeplink jumps to slide 6 (live demo)', async ({ page }) => {
    await page.goto('/pitch#6');
    // Slide 06 = Démo live (slot 06 dans l'ordre actuel)
    await expect(page.locator('text=Démo live').first()).toBeVisible({ timeout: 5000 });
  });

  test('reaching slide 10 disables next button', async ({ page }) => {
    await page.goto('/pitch#10');
    // Slide 10 = closing
    await expect(page.locator('text=simple').first()).toBeVisible({ timeout: 5000 });

    const next = page.getByRole('button', { name: /Slide suivante/i });
    await expect(next).toBeDisabled();
  });
});
