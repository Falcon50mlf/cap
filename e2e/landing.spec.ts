import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test('loads the landing with title and main CTAs', async ({ page }) => {
    await page.goto('/');

    // Wordmark / logo Cap'
    await expect(page.locator('text=Donne-toi').first()).toBeVisible();

    // Primary CTA → /pitch
    const cta = page.getByRole('link', { name: /Lancer Cap/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/pitch');

    // Secondary CTA → /jeux-libres
    const secondary = page.getByRole('link', { name: /Tester un mini-jeu/i }).first();
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveAttribute('href', '/jeux-libres');
  });

  test('primary CTA navigates to /pitch', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /Lancer Cap/i }).first();
    await expect(cta).toBeVisible();
    await Promise.all([page.waitForURL(/\/pitch/, { timeout: 10_000 }), cta.click()]);
    expect(page.url()).toContain('/pitch');
  });

  test('footer links to criteria page', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Critères de sélection des écoles/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/criteres/);
    await expect(page.locator('text=ton école')).toBeVisible();
  });
});
