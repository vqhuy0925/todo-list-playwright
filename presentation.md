---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #2E5CFF;
    font-size: 2.5em;
  }
  h2 {
    color: #333;
    font-size: 1.8em;
  }
  h3 {
    font-size: 1.4em;
    margin-bottom: 0.8em;
  }
  .lead h1 {
    font-size: 3em;
  }
  .emoji-large {
    font-size: 5em;
    text-align: center;
    margin: 0.2em 0;
  }
  .emoji-medium {
    font-size: 3em;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .three-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
  .metric-box {
    background: #f0f7ff;
    border-left: 4px solid #2E5CFF;
    padding: 0.8em;
    margin: 0.4em 0;
  }
  .highlight-red {
    color: #EF4444;
    font-weight: bold;
  }
  .highlight-green {
    color: #10B981;
    font-weight: bold;
  }
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin: 2em 0;
  }
  .icon-box {
    text-align: center;
    padding: 1em;
    border-radius: 8px;
    background: #f8f9fa;
  }
  .icon-box ul {
    text-align: left;
  }
  .icon-box-blue { background: #E3F2FD; }
  .icon-box-purple { background: #F3E5F5; }
  .icon-box-red { background: #FFEBEE; }
  .icon-box-orange { background: #FFF3E0; }
  .icon-box-yellow { background: #FFFDE7; }
  .icon-box-green { background: #E8F5E9; }
  .checklist {
    font-size: 0.9em;
  }
  .timeline {
    display: flex;
    justify-content: space-around;
    margin: 2em 0;
  }
  .timeline-item {
    text-align: center;
    flex: 1;
  }
  strong {
    color: #2E5CFF;
  }
  pre {
    text-align: left;
  }
  code {
    font-size: 0.85em;
  }
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
---

<!-- _class: lead -->

# Stop Fighting Your Tests 🛑

## MCP + AI: Cut Maintenance Time Significantly

<div class="emoji-large">

🤖 ⚡ 🎭

</div>

**Axon Active**
**January 2026**

---

## Today's Journey 🗺️

<div class="columns">
<div>

**Part 1: The Problem**
- Why 50% of your time is wasted
- The chef analogy

**Part 2: The Solution**
- What is MCP?
- How AI controls browser

**Part 3: Live Demo**
- Break code → Test fails
- AI investigates with MCP

</div>
<div>

**Part 4: For Your Role**
- QA, Developer, Manager benefits

**Part 5: Get Started**
- Week 1 plan, ROI numbers

**Reference: 6 Patterns**
- Details at end of slides

</div>
</div>

---

<!-- _class: lead -->

## 🤔

<div style="font-size: 1.5em; margin: 2em 0;">

**Who spent more time this week**
**FIXING tests than WRITING tests?**

</div>

---

<!-- _class: lead -->

## The Simple Truth

<div class="emoji-large">

📋

</div>

<div style="font-size: 1.3em; margin: 2em;">

You're a **chef** spending half your shift
**rewriting recipes** instead of **cooking food**

Every time ingredients change, you update the recipe.
That's test maintenance.

</div>

---

## ✨

### What if AI did the boring stuff?

<div class="comparison">
<div>

**TRADITIONAL**
⏰
30 min/test
😰
High maintenance

</div>
<div>

<div class="emoji-medium">

→ 🤖 →

</div>

</div>
<div>

**WITH MCP**
⚡
Minutes/test
😊
AI handles routine fixes

</div>
</div>

---

## What is Playwright MCP?

<div style="text-align: center; margin: 3em 0;">


<div style="font-size: 1.2em;">

**You** ↔️ **Claude AI** ↔️ **Playwright** ↔️ **Your App**

</div>

</div>

**Model Context Protocol (MCP)** = The bridge

**Simple idea:** AI can actually **RUN** your tests, not just write them.

---

## Playwright MCP: Like Talking to a Robot 🤖

<div class="columns">
<div>

**Think of it like this:**

You have a robot that controls your browser.

Instead of pressing buttons yourself, you **text the robot** what to do.

```
You: "Add a task 'Buy milk'
      and mark it complete"

Robot: "Done! Task added and
        checked off. 3 pending."
```

That's MCP. **Messages** → **Actions**

</div>
<div>

**How You Talk to the Robot:**

```json
{
  "method": "tools/call",
  "params": {
    "name": "browser_run_code",
    "arguments": {
      "code": "await page.fill(input, 'Buy milk');\n
               await page.click('Add task');"
    }
  }
}
```

Robot understands JSON.
Claude speaks JSON fluently.
**You just speak English.**

</div>
</div>

---

## Live Example: Todo App - 5 Actions in 1 Message 🎯

<div style="font-size: 0.85em;">

```javascript
// Navigate to Todo app
await page.goto('http://localhost:3000');

// Add a new task
await page.getByPlaceholder('Add a new task...').fill('Buy groceries');
await page.getByRole('button', { name: 'Add task' }).click();

// Mark it as complete
const newTodo = page.locator('li', { hasText: 'Buy groceries' });
await newTodo.getByRole('checkbox').click();

// Verify pending count updated
const pendingCount = await page.locator('text=Pending Tasks:').textContent();
console.log(`Status: ${pendingCount}`);

// Clean up - clear completed
await page.getByRole('button', { name: 'Clear Completed' }).click();
```

</div>

---

## How MCP Works Under the Hood 🔍

### Every Request Includes Tool Definitions

<div class="columns">
<div>

**The Mechanism:**

1️⃣ **Tool Schemas Sent**: Every AI request includes all tool definitions

2️⃣ **Model Decides**: AI reads available tools, chooses which to use

3️⃣ **Tools Execute**: MCP server runs Playwright, returns results to AI to continue workflow

</div>
<div>

**Example Tool Schema:**

```json
{
  "name": "browser_click",
  "description": "Click element",
  "parameters": { 
    "element": "string",
    "ref": "string",
    "button": "left|right|middle"
  }
}
```

</div>
</div>

---

<!-- _class: lead -->

# Now You Know the Foundation 🎓

<div class="emoji-large">

✅

</div>

<div style="font-size: 1.3em; margin: 2em;">

You understand **MCP** - the bridge between AI and browser.

Now let's see it in action!

</div>

---

## Demo Plan 📋

<div class="timeline">

<div class="timeline-item">
<div style="font-size: 2em;">1️⃣</div>
<div style="font-size: 1.2em; font-weight: bold;">💥 Break It</div>
<div>Change app code</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">2️⃣</div>
<div style="font-size: 1.2em; font-weight: bold;">❌ Test Fails</div>
<div>Run test, see red</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">3️⃣</div>
<div style="font-size: 1.2em; font-weight: bold;">🔍 AI Investigates</div>
<div>AI uses MCP to find why</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">4️⃣</div>
<div style="font-size: 1.2em; font-weight: bold;">✅ Fixed</div>
<div>AI explains + fixes</div>
</div>

</div>

<div style="text-align: center; margin-top: 1em; font-size: 0.9em; color: #666;">

*Demo shows Pattern #6: Investigator*

</div>

---

## Demo Setup: Two Projects 📁

<div class="comparison">
<div>

**todo-list** (App)
`C:\work\workshop\todo-list`

- The application code
- Nuxt 3 + Vue 3
- Run with `npm run dev`
- **We change code here**

</div>
<div>

<div class="emoji-medium">

→

</div>

</div>
<div>

**todo-list-playwright** (Tests)
`C:\work\workshop\todo-list-playwright`

- Regression tests
- Playwright + MCP
- Run: `node tests/basic-automation.js`
- **Failed**

</div>
</div>

<div style="text-align: center; margin-top: 1em;">

** Provide user story to AI, help me analyze the defect **

</div>

---

## Demo Steps (For Presenter) 🎮

### Step-by-Step Guide

**1. Show the Working State**
- Start app: `npm run dev` in todo-list
- Run tests: `npx playwright test` in todo-list-playwright
- Tests pass ✅

**2. Break Something**
- In todo-list: change button text or element
- Example: "Add Task" → "Add Item"

**3. Show the Failure**
- Run tests again → ❌ Test fails
- "Now, let's ask AI to investigate..."

**4. AI Investigation**
- Open Claude Code in todo-list-playwright
- Say: "Test failed. Use MCP to investigate why."
- Watch: AI opens browser, compares expected vs actual
- AI reports: "Button text changed from X to Y"

---

## What This Means for You 👥

<div class="three-columns">
<div class="icon-box icon-box-blue">

<div style="font-size: 2em;">🧪</div>

**QA Engineers**

Spend time on test **design**
not test **maintenance**:

- Write test code
- Maintain selectors

</div>
<div class="icon-box icon-box-purple">

<div style="font-size: 2em;">💻</div>

**Developers**

Tests fix themselves
when you change code

- No more "I broke tests"
- AI updates tests for you, your team review
- Ship faster

</div>
<div class="icon-box icon-box-green">

<div style="font-size: 2em;">📊</div>

**Managers**

Significant reduction
in test maintenance

- Team more productive
- Faster releases
- Clear ROI

</div>
</div>

---

## Real Numbers 📊

|Metric        |Before                                |After                                   |Impact                                              |
|--------------|--------------------------------------|----------------------------------------|----------------------------------------------------|
|📝 Write test  |30 min                                |3 min                                   |<span class="highlight-green">10x faster</span>     |
|🔧 Fix selector|15 min                                |Auto                                    |<span class="highlight-green">100% automated</span> |
|🎲 Find flaky  |Never                                 |Auto                                    |<span class="highlight-green">Catch before CI</span>|
|🔍 Debug fail  |15 min                                |5 min                                   |<span class="highlight-green">3x faster</span>      |
|⏰ Maintenance |<span class="highlight-red">High</span>|<span class="highlight-green">Reduced</span>|<span class="highlight-green">Focus on new tests</span>      |

---

## Real Numbers: Money 💰

<div style="text-align: center;">

**Example scenario:**

<div class="metric-box" style="font-size: 1.1em; margin: 2em auto; max-width: 600px;">

3 QA engineers × 40 hrs/week = **120 hours**

If you save even **10-20%** = **12-24 hours/week** freed up

That's **half a person** refocused on new test coverage

</div>

<div style="font-size: 1.3em; color: #10B981; font-weight: bold;">

**Most teams see ROI within first month** 📈

</div>

</div>

<div style="font-size: 0.9em; color: #666; margin-top: 1em;">

*Results vary by team size, test complexity, and adoption*

</div>

---

## MCP Token Costs 📊

<div class="columns">
<div>

**Context Usage (per session)**

| Component | Tokens | % |
|-----------|--------|---|
| 🧠 System prompt | 6.3k | 3% |
| 🔧 System tools | 13.4k | 7% |
| 🌉 **MCP tools** | 15.0k | **8%** |
| 💬 Messages | - | - |
| 🆓 Free space | - | - |
| 🔄 Auto-compact | 45k | 22% |

</div>
<div>

**What This Costs in $$**

<div class="metric-box">

**Per investigation:** ~$0.05-0.15
**Per test written:** ~$0.02-0.08
**Monthly (active use):** ~$20-50

</div>

**Bottom line:** MCP adds 8% overhead but enables automation that saves hours.

15k tokens = ~$0.01 per call

</div>
</div>

---

<!-- _class: lead -->

## Your Plan 📅

<div class="emoji-large">

🗺️

</div>

### Dead Simple

---

## Week 1: Baby Steps 👶

<div class="timeline">

<div class="timeline-item">
<div style="font-size: 2em;">📦</div>
<strong>Day 1</strong>
Install MCP
<div style="color: #10B981;">5 min</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">🤖</div>
<strong>Day 2</strong>
First test
<div style="color: #10B981;">15 min</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">🔍</div>
<strong>Day 3</strong>
Explore app
<div style="color: #10B981;">10 min</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">🔧</div>
<strong>Day 4</strong>
Fix test
<div style="color: #10B981;">10 min</div>
</div>

<div class="timeline-item">
<div style="font-size: 2em;">🎉</div>
<strong>Day 5</strong>
Show team
<div style="color: #10B981;">5 min</div>
</div>

</div>

<div style="text-align: center; margin-top: 2em; font-size: 1.2em;">

**That's it. Don't overthink it.** 🎯

</div>

---

## The Roadmap 🗓️

<div class="icon-grid">

<div class="icon-box icon-box-blue">
<div style="font-size: 2em;">📅 Month 1</div>
<strong>Pattern #1: Code Writer</strong>
Save 5 hrs/week
</div>

<div class="icon-box icon-box-purple">
<div style="font-size: 2em;">📅 Month 2</div>
<strong>Add Pattern #2: Explorer</strong>
Find coverage gaps
</div>

<div class="icon-box icon-box-orange">
<div style="font-size: 2em;">📅 Month 4</div>
<strong>Add Pattern #4: Chaos</strong>
Kill flaky tests
</div>

<div class="icon-box icon-box-green" style="grid-column: 1 / -1;">
<div style="font-size: 2em;">📅 Month 6+</div>
<strong>All Patterns Combined</strong>
Full automation
</div>

</div>

---

## Getting Started Today 🚀

### Playwright MCP Setup (5 minutes)

**Step 1: Install**

```bash
npm install @playwright/mcp
```

**Step 2: Configure Claude Desktop**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"]
    }
  }
}
```

**Step 3: Start Using**

- Open Claude Desktop
- Say: "Help me with Playwright testing"
- Done! ✅

---

<!-- _class: lead -->

## "But What About…" 🤔

---

## Limitations - Be Honest ⚠️

<div class="columns">
<div>

**MCP Does NOT Handle Well:**

❌ **Complex visual assertions**
- Pixel-perfect comparisons
- Dynamic canvas/charts

❌ **Non-deterministic content**
- Real-time data feeds
- Time-sensitive tests

❌ **Heavy authentication flows**
- Multi-factor auth, CAPTCHA, biometrics

</div>
<div>

**Still Needs Human Review:**

⚠️ **Business logic validation**
- AI doesn't know your domain rules

⚠️ **Edge case prioritization**
- AI finds many issues, you decide importance

⚠️ **Security-sensitive tests**
- Don't expose credentials to AI

**Rule of thumb:** AI = 80% of work, Human = 20% judgment

</div>
</div>

---

## FAQs ❓

<div style="font-size: 0.75em;">

<div class="columns">
<div>

**❓ Will AI replace me?**

<div class="metric-box">
No. AI replaces *tasks*, not *roles*.
You do creative work, AI does repetitive work.
</div>

**❓ What if AI makes mistakes?**

<div class="metric-box">
Git protects you.
</div>

**❓ Isn't it expensive?**

<div class="metric-box">
Cost: $20-50/month
</div>

</div>
<div>

**❓ Does it work with our setup?**

<div class="metric-box">
✅ Nodejs 21+
✅ Playwright (any)
</div>

**❓ Do I need to learn AI?**

<div class="metric-box">
No coding skills needed. You speak English.
</div>

**❓ What if it breaks tests?**

<div class="metric-box">
AI suggests, you approve via PR.
Wrong? `git revert` in 10 seconds.
Start with non-critical tests first.
</div>

**❓ What about sensitive data?**

<div class="metric-box">
✅ Use staging environments only
✅ Never expose prod credentials
✅ MCP runs locally - data stays on your machine
</div>

</div>
</div>

</div>

---

<!-- _class: lead -->

# Do This Monday 📅

<div class="emoji-large">

🚀

</div>

---

<!-- _class: lead -->

## Simple Rule

<div style="font-size: 1.5em; margin: 2em; line-height: 1.5;">

If you're **not using AI** by next Monday,

you're doing **extra work**

for **no reason**

</div>

<div class="emoji-large">

🤷

</div>

---

## Market Alternatives 🔄

<div style="text-align: center; margin-bottom: 1em; font-size: 0.9em; color: #666;">
<em>Commercial tools offering similar capabilities</em>
</div>

<div class="icon-grid">

<div class="icon-box icon-box-blue">
🔧 <strong>#1: Writer</strong><br>
Quick wins<br>
→ Testim, Copilot
</div>

<div class="icon-box icon-box-purple">
👀 <strong>#2: Explorer</strong><br>
Coverage<br>
→ Applitools
</div>

<div class="icon-box icon-box-red">
👊 <strong>#3: Breaker</strong><br>
Security<br>
→ OSS-Fuzz, Mayhem
</div>

<div class="icon-box icon-box-orange">
🌀 <strong>#4: Chaos</strong><br>
Resilience<br>
→ Gremlin, Chaos Monkey
</div>

<div class="icon-box icon-box-yellow">
😇 <strong>#5: User Sim</strong><br>
UX testing<br>
→ test.ai, Rainforest
</div>

<div class="icon-box icon-box-green">
🚀 <strong>#6: All-in-One</strong><br>
Autonomous platforms<br>
→ TestSprite, Mabl, Katalon
</div>

</div>

---

<!-- _class: lead -->

# Questions? 🙋

---

<!-- _class: lead -->

# Remember

<div style="font-size: 1.8em; line-height: 1.6; margin: 2em;">

**Start small** → **Learn** → **Scale**

</div>

<div style="font-size: 1.4em; margin: 2em;">

Start Monday.
Use Tuesday.
Never go back.

</div>

<div style="font-size: 1.8em; font-weight: bold; color: #2E5CFF;">

**It's that simple.** ✨

</div>

---

<!-- _class: lead -->

<div class="emoji-large">

🚀

</div>

# Thank You!

**Let's make testing fun again**

---

## 6 Patterns Quick Reference 📋

<div class="icon-grid" style="margin: 1em 0;">

<div class="icon-box icon-box-blue">
<div style="font-size: 2.5em;">🔧</div>
<strong>Pattern #1: Code Writer</strong>
"You describe, I write"
</div>

<div class="icon-box icon-box-purple">
<div style="font-size: 2.5em;">👀</div>
<strong>Pattern #2: Explorer</strong>
"I find what to test"
</div>

<div class="icon-box icon-box-red">
<div style="font-size: 2.5em;">👊</div>
<strong>Pattern #3: Breaker</strong>
"I break 1000 ways"
</div>

<div class="icon-box icon-box-orange">
<div style="font-size: 2.5em;">🌀</div>
<strong>Pattern #4: Chaos Maker</strong>
"I find flaky tests"
</div>

<div class="icon-box icon-box-yellow">
<div style="font-size: 2.5em;">😇</div>
<strong>Pattern #5: Naive User</strong>
"Like your grandma"
</div>

<div class="icon-box icon-box-green">
<div style="font-size: 2.5em;">🔍</div>
<strong>Pattern #6: Investigator</strong>
"Why did test fail?"
</div>

</div>

---

## Pattern #1: Code Writer 🔧

<div class="columns">
<div>

**What you say:**
> "Create a test: user logs in with wrong password, sees error"

⏰ **Before:** 30 min → ⚡ **After:** 30 sec

</div>
<div>

```javascript
test('login fails', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]',
    'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error'))
    .toContainText('Invalid');
});
```

</div>
</div>

---

## Pattern #2: Explorer 👀

<div class="columns">
<div>

**You tested:** ✅ Happy path

**AI finds:** ❌ 12 missing test cases

</div>
<div>

```
You: "Explore checkout"

AI: [Clicks everything]
    📋 Found: 3 forms, 2 dead buttons
    💡 Suggested: 12 new tests
```

</div>
</div>

---

## Pattern #3: Breaker 👊

**You test:** `'test@test.com'` (1 case)

**AI tests:** 1000+ variations including:
- `'test@test..com'`
- `'💩@test.com'`
- `'<script>alert(1)</script>'`

🐛 Finds 15 edge cases that crash your app

---

## Pattern #4: Chaos Maker 🌀

**Problem:** Test passes Monday, fails Wednesday

**Solution:**
```
You: "Run 100x with chaos"
AI: Failed 7/100 times
    Root cause: Missing wait for animation
    Fix provided ✅
```

---

## Pattern #5: Naive User 😇

**Your test:** Perfect path (login → email → password → submit)

**Real user:** Random clicks, double submits, spaces in fields

**AI finds:** App crashes on double submit, tab order broken

---

## Pattern #6: Investigator 🔍

**Problem:** Test failed, you don't know why

**Solution:**
```
You: "Test failed. Investigate."
AI: [Opens browser, compares expected vs actual]
    🔍 Button text changed: "Add Task" → "Add Item"
    💡 Fix: Update selector
```

---

## Resources & Citations 📚

<div style="font-size: 0.75em;">

<div class="columns">
<div>

**Statistics & Research:**
- [World Quality Report 2022-2023](https://www.itconvergence.com/blog/true-cost-breakdown-of-implementing-and-supporting-test-automation/#:~:text=in%20test%20automation.-,Script%20Maintenance,-Test%20scripts%20require) - 50% maintenance cost
- [DevOps Survey: IT Disruptions](https://devops.com/survey-it-teams-spend-about-a-third-of-time-responding-to-disruptions/) - 55% teams spend 20+ hrs/week

**Playwright MCP:**
- [Microsoft: Playwright E2E with AI](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)
- [GitHub - microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

</div>
<div>

**Case Studies:**
- [SuperAGI: Playwright-MCP Case Study](https://superagi.com/case-study-how-microsofts-playwright-mcp-server-is-transforming-ai-agent-capabilities-in-real-world-scenarios/)

**Community Guides:**
- [ExecuteAutomation: Playwright + Claude MCP](https://medium.com/executeautomation/make-playwright-ui-testing-smart-with-model-context-protocol-of-claude-ai-18c26892193d)
- [Modern Test Automation with AI & Playwright MCP](https://kailash-pathak.medium.com/modern-test-automation-with-ai-llm-and-playwright-mcp-model-context-protocol-0c311292c7fb)

</div>
</div>

</div>
