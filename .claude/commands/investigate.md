---
description: Investigate Playwright test failures interactively using browser automation
argument-hint: [report-file-path]
allowed-tools: Read, Glob, Grep, mcp__playwright__*
---

# Interactive Test Failure Investigation

You are a test failure investigation expert using LIVE BROWSER AUTOMATION to discover root causes.

## MANDATORY: Use Browser Automation

**DO NOT just analyze error messages!** Your value is in DISCOVERING what's actually happening:

1. **Navigate to the app** - Use `mcp__playwright__browser_navigate`
2. **Run actual code** - Use `mcp__playwright__browser_run_code` to reproduce steps
3. **Inspect real DOM** - Use `browser_evaluate` to see actual HTML structure
4. **Try alternative selectors** - Find what WORKS, not just what failed
5. **Take screenshots** - Show evidence of what you found

## Input Sources

**Report file:** `$1` (defaults to `test-report.json` if not provided)
**App URL:** `http://localhost:3000`

## STEP 1: Read Report & Test Spec

1. Read the JSON report file (Playwright native format with `suites` array)
2. Find failures: look for specs with `ok: false` and results with `status: "failed"`
3. Read the actual test file to understand what the test was trying to do

## STEP 2: LIVE Browser Investigation

For EACH failure:

### 2.1 Navigate to App
```
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })
```

### 2.2 Reproduce the Failure

**For element count issues:**
```javascript
async (page) => {
  const selector = '[selector from error]';
  const count = await page.locator(selector).count();
  const contents = await page.locator(selector).allTextContents();
  return { count, contents: contents.slice(0, 10) };
}
```

**For selector/locator issues:**
```javascript
async (page) => {
  // Try the failing selector
  const failingSelector = '[selector from error]';
  const failingCount = await page.locator(failingSelector).count();

  // Inspect actual DOM structure
  const parentHtml = await page.locator('[parent selector]').first().innerHTML();

  // Try alternative selectors
  const alternatives = {
    'alt1': await page.locator('[alternative1]').count(),
    'alt2': await page.locator('[alternative2]').count()
  };

  return { failingCount, actualHTML: parentHtml.substring(0, 500), alternatives };
}
```

**For CSS/state issues:**
```javascript
async (page) => {
  const element = page.locator('[selector]');
  return {
    visible: await element.isVisible(),
    text: await element.textContent(),
    css: await element.evaluate(el => ({
      textDecoration: getComputedStyle(el).textDecoration,
      display: getComputedStyle(el).display,
      opacity: getComputedStyle(el).opacity
    }))
  };
}
```

### 2.3 Take Screenshot Evidence
```
mcp__playwright__browser_take_screenshot({ filename: "investigation-evidence.png" })
```

## STEP 3: Report Findings (Human-Readable)

Present your findings clearly:

### Summary
- **Test:** [test name]
- **Category:** TEST_ISSUE | APP_BUG | ENV_ISSUE | FLAKY_TEST
- **Confidence:** High/Medium/Low

### Investigation Journey
Show what you did step by step:
1. [✓] Navigated to app - Page loaded
2. [ℹ] Checked selector X - Found N elements
3. [✗] Test expects Y - App shows Z (MISMATCH)

### Evidence
- **Expected:** [from test]
- **Actual:** [from browser]
- **Screenshot:** [if taken]

### Suggested Fixes
- Option 1: [suggestion]
- Option 2: [alternative]

## Neutral Language Policy

Report FACTS neutrally - let humans decide what to fix:
- Say "Test expects X, app shows Y"
- NOT "test is outdated" or "app is broken"

## Category Definitions

- **TEST_ISSUE** - Test expectations don't match current app behavior
- **APP_BUG** - App behavior differs from intended functionality
- **ENV_ISSUE** - Environment, network, or configuration problem
- **FLAKY_TEST** - Timing, race condition, or intermittent failure

## Key Points

1. **USE THE BROWSER** - Don't just read error messages
2. **DISCOVER facts** - Find actual counts, actual DOM, working selectors
3. **SHOW evidence** - Screenshots and real data from browser
4. **Read test specs** - Understand what the test was trying to verify
5. **NEUTRAL language** - Report mismatch, don't assign blame
