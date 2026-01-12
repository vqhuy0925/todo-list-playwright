import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial tasks', async ({ page }) => {
    await expect(page.locator('ul > li')).toHaveCount(5);
  });

  test('should mark a task as complete', async ({ page }) => {
    const taskToComplete = page.locator('li', { hasText: 'Go shopping' });
    await taskToComplete.getByRole('checkbox').check();

    await expect(taskToComplete.getByText('Go shopping')).toHaveCSS('text-decoration', /line-through/);
  });

  test('should delete a task', async ({ page }) => {
    const initialCount = await page.locator('ul > li').count();
    const taskToDelete = page.locator('li', { hasText: 'Reading book' });

    await taskToDelete.locator('button:has(i.fa-trash)').click();

    await expect(page.locator('li', { hasText: 'Reading book' })).toHaveCount(0);
    await expect(page.locator('ul > li')).toHaveCount(initialCount - 1);
  });

  test('should clear completed tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Clear Completed' }).click();

    await expect(page.locator('ul > li')).toHaveCount(3);
  });

  test('should clear all tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Clear All' }).click();

    await expect(page.locator('ul > li')).toHaveCount(0);
  });
});
