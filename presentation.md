---
marp: true
theme: default
paginate: true
style: |
  /* ═══════════════════════════════════════════════════════════
     AXON ACTIVE THEME - Professional Dark Style
     ═══════════════════════════════════════════════════════════ */

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg-primary: #0d1b2a;
    --bg-secondary: #1b2838;
    --bg-card: #132a4a;
    --accent-orange: #f97316;
    --accent-cyan: #22d3ee;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.75);
    --border-color: rgba(255, 255, 255, 0.1);
  }

  section {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 50px 60px;
  }

  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 30% 0%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 100%, rgba(249, 115, 22, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  h1 {
    color: #ffffff;
    font-size: 2.4em;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  h2 {
    color: #ffffff;
    font-size: 1.7em;
    font-weight: 700;
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 0.5em;
    color: var(--accent-orange);
  }

  /* Lead slides - darker theme */
  section.lead {
    background: linear-gradient(180deg, #0d1b2a 0%, #1b2838 100%);
    text-align: center;
  }

  .lead h1 {
    font-size: 2.8em;
    color: #ffffff;
  }

  .emoji-large {
    font-size: 4em;
    text-align: center;
    margin: 0.2em 0;
  }

  .emoji-medium {
    font-size: 2.5em;
  }

  /* ═══ DARK CARDS ═══ */
  .glass-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5em;
  }

  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .three-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    text-align: center;
  }

  .center-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .center-img img {
    max-width: 100%;
    height: auto;
  }

  .four-columns {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    text-align: center;
  }

  .comparison {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    text-align: center;
  }

  .comparison ul {
    text-align: left;
  }

  /* Metric boxes - dark style */
  .metric-box {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1em;
    margin: 0.5em 0;
  }

  .highlight-red {
    color: #f87171;
    font-weight: bold;
  }

  .highlight-green {
    color: #4ade80;
    font-weight: bold;
  }

  /* Icon grid */
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin: 1em 0;
  }

  .icon-box {
    text-align: center;
    padding: 0.8em;
    border-radius: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    font-size: 0.9em;
  }

  .icon-box ul {
    text-align: left;
  }

  /* Colored icon boxes - Axon Active style */
  .icon-box-blue {
    background: linear-gradient(180deg, #1e3a5f 0%, #132a4a 100%);
    border-color: rgba(34, 211, 238, 0.3);
  }
  .icon-box-purple {
    background: linear-gradient(180deg, #2d1f5e 0%, #1e1b4b 100%);
    border-color: rgba(139, 92, 246, 0.3);
  }
  .icon-box-red {
    background: linear-gradient(180deg, #5f1e1e 0%, #4a1313 100%);
    border-color: rgba(239, 68, 68, 0.3);
  }
  .icon-box-orange {
    background: linear-gradient(180deg, #5f3a1e 0%, #4a2a13 100%);
    border-color: rgba(249, 115, 22, 0.3);
  }
  .icon-box-yellow {
    background: linear-gradient(180deg, #5f4a1e 0%, #4a3a13 100%);
    border-color: rgba(250, 204, 21, 0.3);
  }
  .icon-box-green {
    background: linear-gradient(180deg, #1e5f3a 0%, #134a2a 100%);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .timeline {
    display: flex;
    justify-content: space-around;
    margin: 2em 0;
  }

  .timeline-item {
    text-align: center;
    flex: 1;
    padding: 1em;
    background: var(--bg-card);
    border-radius: 12px;
    margin: 0 0.5em;
    border: 1px solid var(--border-color);
  }

  /* Todo list style - like the app we're testing! */
  .todo-list {
    list-style: none;
    padding: 0;
    margin: 1em 0;
  }

  .todo-list li {
    display: flex;
    align-items: center;
    gap: 0.8em;
    padding: 0.7em 1em;
    margin: 0.4em 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    font-size: 1.1em;
  }

  .todo-list li::before {
    content: '☐';
    font-size: 1.3em;
    color: var(--accent-cyan);
  }

  .todo-list li.done::before {
    content: '☑';
    color: #4ade80;
  }

  .todo-list li.done {
    text-decoration: line-through;
    opacity: 0.7;
  }

  .todo-list .time {
    margin-left: auto;
    color: #10B981;
    font-size: 0.85em;
    font-weight: 500;
  }

  .todo-list .badge {
    margin-left: auto;
    padding: 0.2em 0.6em;
    border-radius: 8px;
    font-size: 0.75em;
    font-weight: 600;
  }

  .badge-blue { background: rgba(34, 211, 238, 0.2); color: #22d3ee; }
  .badge-cyan { background: rgba(34, 211, 238, 0.2); color: #22d3ee; }
  .badge-purple { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
  .badge-orange { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
  .badge-green { background: rgba(74, 222, 128, 0.2); color: #4ade80; }

  strong {
    color: var(--accent-orange);
    font-weight: 600;
  }

  /* Code blocks - dark style */
  pre {
    text-align: left;
    background: #1b2838 !important;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.8em !important;
    font-size: 0.75em;
  }

  pre code {
    color: #e2e8f0 !important;
  }

  code {
    font-size: 0.8em;
    font-family: 'Consolas', 'Monaco', monospace;
    color: var(--accent-cyan);
  }

  /* Tables - forced dark background */
  table {
    width: auto;
    border-collapse: collapse;
    background: #0d1b2a !important;
    font-size: 0.9em;
    border-left: 3px solid var(--accent-orange);
  }

  th {
    background: #0d1b2a !important;
    padding: 0.5em 1em;
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--accent-cyan) !important;
  }

  td {
    padding: 0.5em 1em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff !important;
    background: #0d1b2a !important;
  }

  tr:last-child td {
    border-bottom: none;
  }

  /* Compact sections */
  section.compact {
    font-size: 0.9em;
  }

  section.compact h2 {
    font-size: 1.6em;
    margin-bottom: 0.4em;
  }

  section.compact h3 {
    font-size: 1.3em;
    margin-bottom: 0.4em;
  }

  section.compact .columns {
    gap: 0.9rem;
  }

  section.compact .metric-box {
    padding: 0.7em;
    margin: 0.35em 0;
  }

  /* Links */
  a {
    color: var(--accent-cyan);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  a:hover {
    border-bottom-color: var(--accent-cyan);
  }

  /* Pagination styling */
  section::after {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8em;
  }
---

<!-- _class: lead -->

# Stop Fighting Your Tests 🛑

## With Playwright MCP

<div class="emoji-large" style="margin: 0.5em 0;">

✨ 🤖 🎭

</div>

<div style="font-size: 1.2em; margin-top: 1em;">

</div>

<div style="margin-top: 2em; font-size: 0.9em; opacity: 0.8;">

**Axon Active** · **January 2026**

</div>

---

## Today's Journey 🗺️

<div class="columns">
<div>

**🤔 The Problem**
- Slow feedback loop
- Requires significant resources to create and maintain automation test

**✨ The Solution**
- MCP: AI-to-Browser bridge

**🎬 Live Demo**

</div>
<div>

</div>
</div>


---

## What is Playwright, Playwright MCP? 🎭

<div class="columns" style="align-items: start;">
<div>

### Playwright

**End-to-end testing framework**

- Write tests in JS/TS/Java/...
- Supports: Chrome, Firefox, Safari, ...
- Auto-wait, screenshots, mock/track/modify network traffic

> 🧑‍💻 **You** write code → Playwright runs it

</div>
<div>

### Playwright MCP

**AI-to-Browser bridge**

- Uses Playwright under the hood
- Enables AI to see, click, type, navigate
- Debug-style communication 

> ✨ **AI** decides → Playwright MCP executes

</div>
</div>

<div style="text-align: center; margin-top: 1em; font-size: 0.85em; color: var(--text-secondary);">

**MCP**: Dynamic Discovery · Stateful · Standardized Schema · 2-way Communication

</div>

---

## Different Applications: Playwright / MCP 🎯

<div class="columns" style="align-items: start;">
<div>

### Use **Playwright** for:

- Regression testing
- Complex assertion criteria
- Complex mock APIs
- Stable applications
- Fixed test steps

> 📋 Deterministic

</div>
<div>

### Use **Playwright MCP** for:

- Exploring features
- Reproducing bugs
- Rapidly changing UIs
- Debugging
- Prototyping tests

> 🧠 Adaptive

</div>
</div>

<div style="text-align: center; margin-top: 1em; font-size: 0.9em;">

💡 **Best practice**: Use MCP to *generate*, Playwright to *run* regression suites

</div>

---

## Setup

<div class="columns">
<div>

### System Requirements

- **Node.js 18+** required
- MCP-compatible client (Claude Code, VS Code, Cursor, etc.)

### Claude Code CLI

```bash
claude mcp add playwright \
  npx @playwright/mcp@latest
```

</div>
<div>

### VS Code / Cursor

Add to your MCP settings:

```
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

</div>
</div>

<div style="text-align: center; margin-top: 1em;">

**Verify installation:** `npx @playwright/mcp@latest --help`

📖 Full docs: [github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

</div>

---

<!-- _class: lead -->

## How Does AI work with Playwright MCP? 🔧

<div class="emoji-large">

👨‍💻

</div>

<div style="font-size: 1.2em;">

Let's dive into the **technical concepts**

</div>


---

## Set up a simple loop for ✨ to **DEBUG your test**

<div class="center-img">

![See → Think → Act Loop](screenshots/simple-loop-see-think-act.png)

</div>

---

## See → Think → Act → Repeat 🔄

> /investigate "Todo List" test report: "should mark a task as complete" failed

<div class="columns">
<div>

**1️⃣ 🎭 reads browser → ✨**

```
checkbox "Watch Netflix" [unchecked]
checkbox "Go shopping" [unchecked]
text "Watch Netflix" (no strikethrough)
```

<div style="font-size: 0.85em; color: var(--text-secondary);">A11y Tree: semantic, compact</div>

</div>
<div>

**2️⃣ Test report tells ✨ what failed**

> "Checkbox clicked but strikethrough never appeared"

**3️⃣ ✨ generates → 🎭 executes**

```
await page.getByRole('checkbox').first().click();
```

</div>
</div>

<div style="text-align: center; margin-top: 0.8em; font-size: 1.1em;">

**4️⃣** ✨ sees no change → **repeat loop** until root cause found

</div>

---

## Playwright MCP Testing Use Cases 🤖

<div class="icon-grid" style="grid-template-columns: repeat(5, 1fr); font-size: 0.85em;">


<div class="icon-box icon-box-red">
<div style="font-size: 1.5em;">🐛</div>
1. Failed Test Investigation
</div>

<div class="icon-box icon-box-purple">
<div style="font-size: 1.5em;">🔍</div>
2. Exploratory Testing → Test Plan
</div>

<div class="icon-box icon-box-blue">
<div style="font-size: 1.5em;">📝</div>
3. User Story → Test Plan → Automated Tests
</div>


<div class="icon-box icon-box-green">
<div style="font-size: 1.5em;">✅</div>
4. Bug Retest
</div>

<div class="icon-box icon-box-orange">
<div style="font-size: 1.5em;">📋</div>
5. Bug Logging / Document Issues
</div>

</div>

<div style="text-align: center; margin-top: 1.5em; font-size: 1.1em;">

Each use case = **AI prompt** + **Playwright MCP browser automation**

</div>

---

## *Yesterday, everything was green. What changed?*

<div style="font-size: 0.65em; text-align: left; background: #1a1a2e; padding: 0.8em; border-radius: 8px; font-family: monospace;">

```
$ npx playwright test

Running 5 tests using 1 worker

  ✓  should display initial tasks (1.2s)
  ✗  should mark a task as complete (2.1s)
     Error: Locator.click: Error: strict mode violation
     Call log: waiting for getByRole('checkbox')

  ✗  should delete a task (1.8s)
  ✗  should clear completed tasks (1.5s)
  ✗  should clear all tasks (1.4s)

  1 passed (1.2s)
  4 failed
```

</div>

<div style="font-size: 1.1em; color: var(--text-secondary); margin-top: 1em;">


</div>

---

<!-- _class: lead -->

## Now, From a QA Perspective... 🎯

<div class="emoji-large">

👩‍💻

</div>

<div style="font-size: 1.2em;">

How can **QA Engineers** leverage AI + Playwright MCP in daily work?

</div>


---

## Use Case 1: Exploratory Testing & Test Plan Generation 🔍

<div class="glass-card" style="font-size: 0.8em;">

**Prompt**: Act as QA Engineer. Explore [URL/Feature]. Navigate main flows, inspect UI/UX, test edge cases, check accessibility.

**Output**: Generate test plan with:
- Summary of application under test
- 5-10 test cases (happy path + edge cases)
- Bugs/observations found
- Playwright snippets for automation

</div>

---

## Use Case 2: User Story → Test Plan → Automated Tests 📝

<div class="glass-card" style="font-size: 0.8em;">

**Prompt**: Act as QA Lead. Convert user stories [PASTE STORIES] to test suite.

**Phases**:
- **Phase 1**: Extract acceptance criteria, generate test plan (happy path + 2 edge cases per story)
- **Phase 2**: Verify live via Playwright MCP, confirm selectors exist
- **Phase 3**: Generate TypeScript test file with POM patterns, getByRole locators

</div>

---

<!-- _class: -->

## Use Case 3: Failed Test Investigation 🐛

<div class="glass-card" style="font-size: 0.8em;">

**Prompt**:
Act as Debugging Specialist. Investigate failing test [FILE + ERROR].
- Live reproduce the failure
- Analyze element state (visibility, ARIA, overlays)
- Check console errors & network (4xx/5xx)
- Provide: RCA, proposed fix, live verification of fix

</div>

---

## Use Case 4: Bug Retest ❌→✅

<div class="glass-card" style="font-size: 0.8em;">

**Prompt**: Act as QA Engineer. Retest bug [BUG ID + REPRO STEPS].

**Steps**:
- Execute repro steps via Playwright
- Inspect page state, network calls, DOM
- Verdict: 'BUG FIXED' or 'BUG PERSISTS' with evidence
- Bonus: Generate regression test script

</div>

---

## Use Case 5: Bug Logging / Document Issues 📋

<div class="glass-card" style="font-size: 0.8em;">

**Prompt**: Act as QA Engineer. Document bug [DESCRIBE ISSUE].

**Steps**:
- Reproduce & record steps
- Collect: console logs, network errors, screenshot
- Analyze root cause (hidden/disabled/covered element)
- Generate bug report: title, severity, environment, steps, actual vs expected, technical evidence

</div>


---

## What This Means for You 👥

<div class="columns">
<div class="icon-box icon-box-purple">

<div style="font-size: 2em;">💻</div>

**Developers**

Earlier feedback loop

</div>
<div class="icon-box icon-box-blue">

<div style="font-size: 2em;">🧪</div>

**QA Engineers**

Spend less time on testing process

</div>
</div>


---

## Limitations - Be Honest ⚠️

<div class="columns">
<div>

**🤖 Does NOT Handle Well:**

❌ **Complex visual assertions**

❌ **Non-deterministic content**
- Real-time data feeds
- Time-sensitive tests

❌ **Heavy authentication flows**
- Multi-factor auth, CAPTCHA, biometrics

</div>
<div>

**Still Needs Human Review:**

⚠️ **Business logic validation**
⚠️ **Edge case prioritization**
- ✨ finds many issues, you decide importance

⚠️ **Security-sensitive tests**
- Don't expose credentials to ✨

**Rule of thumb:** 
- 80% ✨ work
- 20% Human judgment

</div>
</div>

---

<!-- _class: lead -->

# Questions? 🙋


---

<!-- _class: lead -->

<div class="emoji-large">

🍀

</div>

# Thank You!

<div style="font-size: 1.3em; margin: 1em 0;">

**Let's make testing fun again**

</div>

