# 6 Patterns Cheatsheet: AI-Assisted Testing Prompts

> Copy-paste these prompts into Claude Desktop / Claude Code with Playwright MCP enabled.

---

## Pattern #1: Code Writer

**When to use**: Need a new test fast

```
Write a Playwright test for:

**App**: http://localhost:3000
**Scenario**: [What user does]
**Expected**: [What to verify]

Use @playwright/test with semantic locators (getByRole, getByText).
```

**Example**:
```
Write a Playwright test for:

**App**: http://localhost:3000 (Todo List)
**Scenario**: User adds task "Buy milk" with high priority
**Expected**: Task appears in list with red priority badge

Use @playwright/test with semantic locators.
```

---

## Pattern #2: Explorer

**When to use**: Find coverage gaps

```
Explore [URL] using Playwright MCP:

1. Take accessibility snapshot
2. Click all interactive elements
3. List all forms, buttons, flows
4. Identify untested scenarios

Output: Prioritized test case recommendations
```

**Example**:
```
Explore http://localhost:3000 using Playwright MCP:

1. Take accessibility snapshot
2. Try each feature: add, edit, delete, filter, clear
3. What inputs and buttons exist?
4. What edge cases are not covered?

Output: Prioritized test case recommendations
```

---

## Pattern #3: Breaker

**When to use**: Security and edge case testing

```
Break the [feature] at [URL] with:

- Empty / whitespace inputs
- Very long strings (1000+ chars)
- XSS: <script>alert(1)</script>
- SQL: '; DROP TABLE--
- Emojis and unicode
- Rapid double-clicks

Report: Input -> Result -> Bug or OK?
```

**Example**:
```
Break the "Add Task" input at http://localhost:3000 with:

- Empty string
- 500 characters
- <script>alert('xss')</script>
- Emoji only: 🎉🔥💀

Report: Input -> Result -> Bug or OK?
```

---

## Pattern #4: Chaos Maker

**When to use**: Find flaky tests

```
Run this test [X] times:

File: [test path]
Command: npx playwright test [name] --repeat-each=20

Track:
- Pass/fail ratio
- Error messages
- Timing patterns

Identify: Missing waits? Race conditions? State pollution?
Provide fix.
```

**Example**:
```
Run "should add a new task" 20 times:

File: tests/todo-app.spec.js
Command: npx playwright test --grep "add a new task" --repeat-each=20

If flaky, identify root cause and provide fix.
```

---

## Pattern #5: Naive User

**When to use**: UX and accessibility testing

```
Use [URL] like a first-time user:

- Click buttons in wrong order
- Double-click everything
- Submit forms incomplete
- Tab through page (check focus)
- Use browser back button
- Refresh mid-action

Report: Confusing behaviors, missing errors, broken keyboard nav
```

**Example**:
```
Use http://localhost:3000 like someone who never used a todo app:

- Click "Clear All" with no tasks
- Add task without selecting priority
- Double-click Add button rapidly
- Tab through entire page

Report what breaks or confuses.
```

---

## Pattern #6: Investigator

**When to use**: Debug test failures

```
Test failing. Investigate:

**File**: [test path]
**Error**: [paste error message]

Using Playwright MCP:
1. Navigate to app
2. Screenshot current state
3. Reproduce steps manually
4. Compare: selector valid? text changed? new elements?

Output: Root cause + fix + prevention
```

**Example**:
```
Test failing. Investigate:

**File**: tests/todo-app.spec.js
**Error**: locator('button:has-text("Add")') - not found

Using Playwright MCP:
1. Go to http://localhost:3000
2. Snapshot the page
3. What does the Add button look like now?

Output: Root cause + correct selector + prevention
```

---

## Quick Reference

| # | Pattern | Trigger Phrase | Use Case |
|---|---------|----------------|----------|
| 1 | Code Writer | "Write a Playwright test for..." | New tests |
| 2 | Explorer | "Explore and identify gaps..." | Coverage |
| 3 | Breaker | "Break with edge cases..." | Security |
| 4 | Chaos Maker | "Run X times, find flaky..." | Stability |
| 5 | Naive User | "Use like first-time user..." | UX/A11y |
| 6 | Investigator | "Test failing, investigate..." | Debug |

---

## Pro Tips

| Tip | Why |
|-----|-----|
| Always include URL | AI needs to navigate |
| Paste full error message | More context = better fix |
| Specify output format | "Generate code" vs "List issues" |
| Chain patterns | Explorer -> Code Writer -> Chaos Maker |
| Save good prompts | Build team prompt library |

---

## Prompt Template

```
[PATTERN NAME]

Context:
- App: [URL]
- Feature: [what to test]
- Current state: [any setup needed]

Task:
[What you want AI to do]

Output format:
[Code / List / Report]
```

---

*Generated for Axon Active Workshop - AI + MCP + Playwright*
