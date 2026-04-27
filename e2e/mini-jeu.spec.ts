import { expect, test } from '@playwright/test';

// Vérifie le rendu d'un mini-jeu Marketing (Mapping Concurrentiel).
// On ne joue pas le drag&drop end-to-end (complexe à scripter avec
// pointer-events) — on vérifie que le jeu monte, que les boutons clés
// sont là, et que le hub des jeux est navigable.

test.describe('Mini-jeu Marketing — Mapping Concurrentiel', () => {
  test('hub des jeux Marketing affiche les 7 jeux', async ({ page }) => {
    await page.goto('/decouverte/marketing/jeux');
    await expect(page.locator('text=7 mini-jeux')).toBeVisible();
    // Au moins le 1er jeu est jouable
    await expect(page.locator('text=Mapping Concurrentiel').first()).toBeVisible();
  });

  test('Mapping Concurrentiel charge avec sa 1ère manche', async ({ page }) => {
    await page.goto('/decouverte/marketing/jeux/mapping-concurrentiel');

    // Header de jeu
    await expect(page.locator('text=Mapping Concurrentiel').first()).toBeVisible();

    // Manche 1 / 3 (le manche counter dans le header GameShell)
    await expect(page.locator('text=/Manche 01.*\\/.*03/i')).toBeVisible();

    // Pool des marques (manche Auto = Dacia Toyota BMW Tesla Lamborghini)
    await expect(page.getByRole('button', { name: /\+ Dacia/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /\+ Tesla/ })).toBeVisible();

    // Bouton Valider présent (mais désactivé tant que pas tout placé)
    const validate = page.getByRole('button', { name: /Place encore|Valider/i });
    await expect(validate).toBeVisible();
  });

  test('peut placer une marque via le bouton "+" du pool', async ({ page }) => {
    await page.goto('/decouverte/marketing/jeux/mapping-concurrentiel');

    // Click "+ Dacia" → place au centre
    await page.getByRole('button', { name: /\+ Dacia/ }).click();

    // Dacia disparaît du pool (= n'a plus le préfixe "+")
    await expect(page.getByRole('button', { name: /\+ Dacia/ })).toHaveCount(0);
  });
});
