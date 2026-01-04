# Investigate Test Failures

Investigate test failures by running test snippets and visually verifying the application state.

## Arguments
- `$ARGUMENTS` - One or more of:
  - Test output/error message to investigate
  - Jenkins URL (e.g., `http://localhost:5555/job/todo-list-playwright/123/`)
  - Path to test report (e.g., `playwright-report/index.html`)
  - Specific test name (e.g., `should add a new task`)
  - **User story URL** (Jira, Azure DevOps, GitHub Issue, etc.)

## Test Spec Location
- **Main test file**: `tests/todo-app.spec.js`
- **App URL**: http://localhost:3000

## Instructions

### Step 1: Parse Input
- If test output: Extract the failing test name and assertion
- If Jenkins URL: Fetch console output using WebFetch
- If report path: Read the report file
- If test name: Find it in `tests/todo-app.spec.js`
- **If user story URL**: Fetch using WebFetch to extract:
  - Acceptance criteria
  - Expected behavior
  - Business requirements

### Step 1b: Fetch User Story (if provided)
If a user story URL is given, use `WebFetch` to retrieve:

```
User Story: [Title]
Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Expected Behavior:
- When user does X, then Y should happen
```

Keep this context for Step 3 analysis - it determines if behavior is correct.

### Step 2: Run the Failing Test Snippet
Use Playwright MCP `browser_run_code` to execute the relevant test code:

```javascript
// Example: Run the assertion that failed
await page.goto('http://localhost:3000');

// Execute the specific test steps from todo-app.spec.js
// e.g., for "should display initial tasks":
const taskCount = await page.locator('ul > li').count();
const pendingText = await page.locator('p', { hasText: 'Pending Tasks:' }).textContent();
console.log(`Tasks: ${taskCount}, Pending: ${pendingText}`);
```

### Step 3: Analyze Results

**If test code WORKS:**
- Compare actual vs expected values
- Determine: Is this a real bug or outdated test expectation?

**If test code FAILS (selector not found, timeout, etc.):**
- Take screenshot: `browser_take_screenshot`
- Get A11y tree: `browser_snapshot`
- Identify alternative selectors from A11y tree
- Report which selectors are broken

**If user story was provided, also check:**
- Does actual app behavior match acceptance criteria?
- Is the test correctly validating the user story?
- Is there a mismatch between story requirements and test expectations?

| Scenario | Verdict |
|----------|---------|
| App matches story, test wrong | `TEST NEEDS UPDATE` |
| App doesn't match story | `REAL BUG` |
| Test matches story, app wrong | `REAL BUG` |
| Story unclear, need clarification | `NEEDS CLARIFICATION` |

### Step 4: Report Findings

Provide a structured report:

```
## Investigation Report

**Test:** [test name]
**Status:** [REAL BUG | TEST NEEDS UPDATE | SETUP ISSUE | NEEDS CLARIFICATION]

### User Story Context (if provided)
**Story:** [Story ID/Title]
**Acceptance Criteria:**
- [x] Criterion met
- [ ] Criterion NOT met ← Issue here

### What Failed
- Expected: [expected value]
- Actual: [actual value]

### Root Cause
[Explanation of why it failed]

### User Story Alignment
| Component | Matches Story? |
|-----------|---------------|
| App behavior | ✅ Yes / ❌ No |
| Test assertion | ✅ Yes / ❌ No |

**Conclusion:** [Who is wrong - App, Test, or Story unclear?]

### Evidence
- Screenshot: [attached]
- A11y Tree: [relevant portion]

### Suggested Fix
[If TEST NEEDS UPDATE, provide the fix:]

File: tests/todo-app.spec.js
Line: [line number]

\`\`\`diff
- await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('2');
+ await expect(page.locator('p', { hasText: 'Pending Tasks:' })).toContainText('3');
\`\`\`

[If REAL BUG, describe what app should do per user story]
```

## Common Test Patterns in todo-app.spec.js

| Test | Key Assertions |
|------|----------------|
| `should display initial tasks` | 4 tasks, 3 pending |
| `should add a new task` | New task visible, pending +1 |
| `should mark a task as complete` | line-through CSS, pending -1 |
| `should delete a task` | Task removed, pending updated |
| `should clear completed tasks` | Only pending tasks remain |
| `should clear all tasks` | 0 tasks, 0 pending |

## Key Selectors Reference

```javascript
// Tasks
page.locator('ul > li')                           // All tasks
page.locator('li', { hasText: 'Task name' })      // Specific task

// Input & Add
page.getByPlaceholder('Add a new task...')        // Input field
page.locator('button:has(i.fa-plus)')             // Add button

// Task actions
taskRow.getByRole('checkbox')                      // Complete checkbox
taskRow.locator('button:has(i.fa-trash)')         // Delete button

// Buttons
page.getByRole('button', { name: 'Clear Completed' })
page.getByRole('button', { name: 'Clear All' })

// Status
page.locator('p', { hasText: 'Pending Tasks:' })  // Pending count
```

## Workflow

1. **Fetch user story** (if URL provided) → Extract acceptance criteria
2. **Run test snippet** via `browser_run_code` to get actual values
3. **If error** → Screenshot + A11y snapshot to find correct selectors
4. **Compare** expected vs actual vs user story requirements
5. **Diagnose**: Bug vs Test update vs Setup issue vs Needs clarification
6. **Suggest fix** with file path and diff (or report bug to dev team)

## Example Usage

```bash
# Basic - just test failure
/investigate should display initial tasks

# With error message
/investigate Expected "Pending Tasks: 2" but got "Pending Tasks: 3"

# With Jenkins build
/investigate http://localhost:5555/job/todo-list-playwright/42/

# With user story for context
/investigate https://jira.company.com/browse/TODO-123 test "should add a new task" failed

# Multiple inputs
/investigate https://github.com/org/repo/issues/45 Jenkins: http://localhost:5555/job/todo-list-playwright/99/
```

When user story is provided, the investigation will:
1. Fetch story requirements first
2. Compare app behavior against acceptance criteria
3. Determine if failure is bug (app wrong) or test issue (test wrong)

---

Input to investigate:
$ARGUMENTS
