# Project: Todo List Playwright Tests

## Overview
This project contains Playwright E2E tests for the Todo List application located at `C:\work\workshop\todo-list`.

## Architecture
- **Application**: `C:\work\workshop\todo-list` - The main Todo List web app
- **Tests**: `C:\work\workshop\todo-list-playwright` - Playwright test suite

## Playwright MCP Usage Guidelines

### Token Efficiency Rule
When using Playwright MCP for browser operations, **always delegate to a new agent  @agent-general-purpose** instead of running MCP tools directly. This reduces token consumption significantly.

### How to Delegate Playwright MCP Operations

Instead of calling MCP tools directly, use the Task tool with clear context:

```
Task tool:
- subagent_type: "general-purpose"
- prompt: Include these details:
  1. What URL to navigate to
  2. What actions to perform (click, type, screenshot)
  3. What to look for or verify
  4. What information to report back
```

### Example: Investigating Test Failure

```markdown
Prompt for agent:
"Navigate to http://localhost:3000 using Playwright MCP.
Take a screenshot of the initial state.
Try to add a todo item with text 'Test item'.
Report back:
- Did the add button work?
- Any console errors?
- Screenshot of final state"
```

### Example: Visual Verification

```markdown
Prompt for agent:
"Using Playwright MCP, navigate to http://localhost:3000.
1. Take snapshot of the page accessibility tree
2. Check if 'Add Todo' button exists
3. Check if input field is visible
4. Report the UI structure back"
```

## Commands (always use public registry --registry=https://registry.npmjs.org)
- `npx playwright test --registry=https://registry.npmjs.org` - Run all tests
- `npx playwright test --ui --registry=https://registry.npmjs.org` - Run with UI mode
- `npx playwright test <test-file> --registry=https://registry.npmjs.org` - Run specific test

## Demo Scenario
This project demonstrates AI-assisted test failure investigation:
1. Code changes in todo-list app cause regression
2. Tests in this project start failing
3. AI agent uses Playwright MCP to investigate the issue visually

## CI/CD Integration
This project includes a `Jenkinsfile` for CI/CD integration.
- Jenkins workspace: `C:\ProgramData\Jenkins\.jenkins\workspace\todo-list-playwright`
- Jenkins server URL: `http://localhost:5555/`
- Playwright browsers cache: `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers`

## Workshop Cleanup

After completing the workshop, run these commands to clean up:

```cmd
:: Delete cached Playwright browsers (~280MB)
rmdir /s /q "C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers"

:: Delete Jenkins job (via Jenkins UI or API)
:: Go to http://localhost:5555/job/todo-list-playwright/ -> Delete Pipeline

:: Optional: Clean npm cache
npm cache clean --force
```

### Files/Folders Created During Workshop
| Location | Description | Size |
|----------|-------------|------|
| `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers` | Cached Chromium browsers | ~280MB |
| `C:\ProgramData\Jenkins\.jenkins\jobs\todo-list-playwright` | Jenkins job config | ~1MB |
| `C:\ProgramData\Jenkins\.jenkins\tools\jenkins.plugins.nodejs.tools.NodeJSInstallation\NodeJS` | NodeJS installation | ~80MB |
