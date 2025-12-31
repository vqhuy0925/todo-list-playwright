import { test, expect } from '@playwright/test';

test.describe.serial('Todo App', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should display initial tasks', async () => {
    await expect(page.locator('ul > li')).not.toHaveCount(0);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toBeVisible();
  });

  test.skip('should add a new task', async () => {
    const newTask = 'Learn basic automation';

    await page.getByPlaceholder('Add a new task...').fill(newTask);
    await page.locator('select').first().selectOption('medium');
    await page.locator('button:has(i.fa-plus)').click();

    await expect(page.locator('li', { hasText: newTask })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('4');
  });

  test('should mark a task as complete', async () => {
    const taskToComplete = page.locator('li', { hasText: 'Go shopping' });

    await taskToComplete.getByRole('checkbox').check();

    const taskText = taskToComplete.locator('div > div').first();
    await expect(taskText).toHaveCSS('text-decoration', /line-through/);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('3');
  });

  test.skip('should delete a task', async () => {
    const taskToDelete = page.locator('li', { hasText: 'Reading book' });

    await taskToDelete.locator('button:has(i.fa-trash)').click();

    await expect(page.locator('li', { hasText: 'Reading book' })).toHaveCount(0);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('2');
  });

  test.skip('should clear completed tasks', async () => {
    await page.getByRole('button', { name: 'Clear Completed' }).click();

    await expect(page.locator('li', { hasText: 'Watch Netflix' })).toHaveCount(0);
    await expect(page.locator('li', { hasText: 'Go shopping' })).toHaveCount(0);
    await expect(page.locator('li', { hasText: 'Learn basic automation' })).toHaveCount(1);
    await expect(page.locator('li', { hasText: 'Eat sashimi' })).toHaveCount(1);
    await expect(page.locator('ul > li')).toHaveCount(2);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('2');
  });

  test.skip('should clear all tasks', async () => {
    await page.getByRole('button', { name: 'Clear All' }).click();

    await expect(page.locator('ul > li')).toHaveCount(0);
    await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('0');
  });
});
