import playwright from 'playwright';
const { chromium } = playwright;
import assert from 'node:assert';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Starting basic automation script...');

  // 1. Setup: Launch browser and create a new page
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 2. Navigate to the application
    await page.goto('http://localhost:3000/');
    console.log('Navigated to the To-Do app');

    // 3. Verify Initial State
    const initialTaskCount = await page.locator('ul > li').count();
    assert.strictEqual(initialTaskCount, 5, 'Initial task count should be 5');
    console.log('Verified initial task count');

    const pendingTasksSpan = page.locator('p', { hasText: 'Pending Tasks:' }).locator('span');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '3', 'Initial pending tasks should be 3');
    console.log('Verified initial pending task count');

    // 4. Add a new task
    const newTask = 'Learn basic automation';
    await page.getByPlaceholder('Add a new task...').fill(newTask);
    await page.locator('button:has(i.fa-plus)').click();
    console.log(`Added new task: "${newTask}"`);

    // 5. Verify the new task was added
    const newTaskItem = page.locator('li', { hasText: newTask });
    await newTaskItem.waitFor({ state: 'visible' });
    assert.ok(await newTaskItem.isVisible(), 'Newly added task should be visible');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '4', 'Pending tasks should be 4 after adding one');
    console.log('Verified new task is in the list and counter updated');

    // 6. Mark a task as complete
    const taskToComplete = page.locator('li', { hasText: 'Go shopping' });
    await taskToComplete.getByRole('checkbox').check();
    console.log('Marked "Go shopping" as complete');

    // 7. Verify task is completed and counter is updated
    const completedSpan = taskToComplete.locator('span');
    const hasLineThrough = await completedSpan.evaluate(el => getComputedStyle(el).textDecoration.includes('line-through'));
    assert.ok(hasLineThrough, '"Go shopping" task should have line-through style');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '3', 'Pending tasks should be 3 after completing one');
    console.log('Verified task completion and counter update');

    // 8. Delete a task
    const taskToDelete = page.locator('li', { hasText: 'Reading book' });
    await taskToDelete.locator('button:has(i.fa-trash)').click();
    console.log('Deleted task "Reading book"');

    // 9. Verify task is deleted
    await assert.strictEqual(await page.locator('li', { hasText: 'Reading book' }).count(), 0, 'Deleted task should not be in the list');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '2', 'Pending tasks should be 2 after deleting one');
    console.log('Verified task is no longer in the list');

    // 10. Test "Clear Completed" bulk action
    await page.getByRole('button', { name: 'Clear Completed' }).click();
    await assert.strictEqual(await page.locator('li', { hasText: 'Play Valorant' }).count(), 0, '"Play Valorant" should be cleared');
    await assert.strictEqual(await page.locator('li', { hasText: 'Watch netflix' }).count(), 0, '"Watch netflix" should be cleared');
    await assert.strictEqual(await page.locator('li', { hasText: 'Go shopping' }).count(), 0, '"Go shopping" should be cleared');
    await assert.strictEqual(await page.locator('li', { hasText: 'Learn basic automation' }).count(), 1, '"Learn basic automation" should NOT be cleared as it is pending');
    await assert.strictEqual(await page.locator('li', { hasText: 'Eat sashimi' }).count(), 1, '"Eat sashimi" should NOT be cleared as it is pending');
    await assert.strictEqual(await page.locator('li').count(), 2, 'Should have 2 tasks remaining after clearing completed');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '2', 'Pending tasks should be 2 after clearing completed');
    console.log('Verified "Clear Completed" action works correctly');

    // 11. Test "Clear All" bulk action
    await page.getByRole('button', { name: 'Clear All' }).click();
    const finalTaskCount = await page.locator('ul > li').count();
    assert.strictEqual(finalTaskCount, 0, 'Task list should be empty after "Clear All"');
    await assert.strictEqual(await pendingTasksSpan.innerText(), '0', 'Pending tasks should be 0 after "Clear All"');
    console.log('Verified "Clear All" action works correctly (all tasks removed)');

    console.log('\n All basic automation steps completed successfully!');

  } catch (error) {
    console.error('An error occurred during the automation script:');
    console.error(error);
    process.exit(1);
  } finally {
    // 12. Teardown: Close the browser
    await browser.close();
    console.log('🔒 Browser closed.');
  }
})();