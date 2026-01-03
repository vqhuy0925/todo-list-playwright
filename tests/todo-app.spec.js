import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial tasks', async ({ page }) => {
    // Master branch has 5 initial tasks
    await expect(page.locator('ul > li')).toHaveCount(5);
    // 3 pending tasks (Go shopping, Reading book, Eat sashimi)
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('3');
  });

  test('should add a new task', async ({ page }) => {
    const newTask = 'Learn Playwright testing';

    // Get initial count
    const initialCount = await page.locator('ul > li').count();

    // Fill in the task input
    await page.getByPlaceholder('Add a new task...').fill(newTask);

    // Click the add button (has fa-plus icon)
    await page.locator('button:has(i.fa-plus)').click();

    // Verify the new task appears
    await expect(page.locator('li', { hasText: newTask })).toBeVisible();

    // Task count should increase by 1
    await expect(page.locator('ul > li')).toHaveCount(initialCount + 1);
  });

  test('should mark a task as complete', async ({ page }) => {
    // Find a pending task and mark it complete
    const taskToComplete = page.locator('li', { hasText: 'Go shopping' });

    // Click the checkbox
    await taskToComplete.getByRole('checkbox').check();

    // Verify strikethrough is applied to the span element (master branch structure)
    const taskText = taskToComplete.locator('label span');
    await expect(taskText).toHaveCSS('text-decoration', /line-through/);
  });

  test('should delete a task', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('ul > li').count();

    // Delete a task
    const taskToDelete = page.locator('li', { hasText: 'Reading book' });

    // Click the delete button (has fa-trash icon)
    await taskToDelete.locator('button:has(i.fa-trash)').click();

    // Verify task is removed
    await expect(page.locator('li', { hasText: 'Reading book' })).toHaveCount(0);

    // Task count should decrease by 1
    await expect(page.locator('ul > li')).toHaveCount(initialCount - 1);
  });

  test('should clear completed tasks', async ({ page }) => {
    // First mark a task as complete
    const taskToComplete = page.locator('li', { hasText: 'Go shopping' });
    await taskToComplete.getByRole('checkbox').check();

    // Click Clear Completed button
    await page.getByRole('button', { name: 'Clear Completed' }).click();

    // The completed task should be removed
    await expect(page.locator('li', { hasText: 'Go shopping' })).toHaveCount(0);
  });

  test('should clear all tasks', async ({ page }) => {
    // Click Clear All button
    await page.getByRole('button', { name: 'Clear All' }).click();

    // All tasks should be removed
    await expect(page.locator('ul > li')).toHaveCount(0);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('0');
  });
});
