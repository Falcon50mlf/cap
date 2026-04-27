import { expect, test } from '@playwright/test';

// Tests d'auth — vérifie les écrans (pas le signup réel pour ne pas
// polluer Supabase à chaque CI run).

test.describe('Auth flow', () => {
  test('/login displays the form with email + password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByPlaceholder(/prenom@/i)).toBeVisible();
    await expect(page.getByPlaceholder(/mot de passe|min\. 6 caractères/i)).toBeVisible();
    // CTA principal
    await expect(page.getByRole('button', { name: /Se connecter|Créer mon compte/i })).toBeVisible();
  });

  test('toggle login ↔ signup', async ({ page }) => {
    await page.goto('/login');

    // Par défaut on est en login. Toggle vers signup.
    await page.getByRole('button', { name: /Crée ton compte/i }).click();
    await expect(page.getByRole('button', { name: /Créer mon compte/i })).toBeVisible();

    // Re-toggle vers login
    await page.getByRole('button', { name: /Connecte-toi/i }).click();
    await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible();
  });

  test('disabled submit when password too short', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder(/prenom@/i).fill('test@cap.app');
    await page.getByPlaceholder(/mot de passe|min\. 6 caractères/i).fill('123'); // < 6

    const submit = page.getByRole('button', { name: /Se connecter|Créer mon compte/i });
    await expect(submit).toBeDisabled();
  });

  test('/onboarding redirects to /login when no session', async ({ page }) => {
    await page.goto('/onboarding');
    // /onboarding fait un router.replace('/login') si pas de session
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
