---
description: Start all workshop services (Todo App, MailHog, Test Investigator)
argument-hint: [-h|--help] [--model haiku|sonnet|opus]
---

# Workshop Start

Start all services needed for the AI-assisted test investigation workshop demo.

## Arguments Received
`$ARGUMENTS`

## Help Mode

If arguments contain `-h` or `--help`, display this help and exit without starting services:

```
/workshop-start - Start all workshop demo services

OPTIONS:
  -h, --help           Show this help message
  --model <model>      Set AI model for Test Investigator
                       Values: haiku (default), sonnet, opus

SERVICES STARTED:
  Port 3000  - Todo App (Vue.js application)
  Port 3500  - Test Investigator API
  Port 8025  - MailHog Web UI (email testing)

EXAMPLES:
  /workshop-start              # Start with default (haiku)
  /workshop-start --model sonnet
  /workshop-start -h

RELATED COMMANDS:
  /workshop-end                # Stop all services
  /verify                      # Verify app state
  /investigate                 # Run test investigation
```

## Model Selection

Parse arguments for `--model`:
- `--model haiku` → set CLAUDE_MODEL=haiku (default, fastest)
- `--model sonnet` → set CLAUDE_MODEL=sonnet (balanced)
- `--model opus` → set CLAUDE_MODEL=opus (most capable)

If no model specified, default to `haiku`.

## Startup Procedure

**IMPORTANT:** Use the TodoWrite tool to create and track progress through these steps. This ensures reliable execution and gives the user visibility into progress.

Execute these commands in order. Use PowerShell for Windows compatibility.

### 0. Clear Stale Processes (Prevent EADDRINUSE)
Before starting services, kill any stale processes on workshop ports:
```bash
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3000
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3500
```

### 1. Switch Todo App to master branch
The demo requires the `master` branch (contains the bug). Switch before starting:
```bash
cd C:/work/workshop/todo-list && git checkout master
```

### 2. Start MailHog (Docker)
```bash
docker start mailhog
```
If container doesn't exist:
```bash
docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog:v1.0.1
```

### 3. Start Todo App (Background)
```bash
cd C:/work/workshop/todo-list && npm run dev
```
Run in background mode. **This is the slowest service to start (~8 seconds).**

### 4. Start Test Investigator (Background)
Use the selected model:
```bash
cd C:/work/workshop/test-investigator-ai && set CLAUDE_MODEL=<selected-model> && npm start
```
Run in background mode.

### 5. Wait and Verify
Wait **10 seconds** (Todo App Vue dev server is slowest to start), then verify each service with PowerShell.

**IMPORTANT:** Use `localhost` (not `127.0.0.1`) for verification - some services bind to IPv6 `[::1]` only, and `localhost` handles both IPv4 and IPv6.

```powershell
(Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5).StatusCode
(Invoke-WebRequest -Uri 'http://localhost:3500/api/health' -UseBasicParsing -TimeoutSec 5).StatusCode
(Invoke-WebRequest -Uri 'http://localhost:8025' -UseBasicParsing -TimeoutSec 5).StatusCode
```

**Retry Logic:** If any verification fails, wait 3 more seconds and retry **twice** before reporting failure. Total max wait: ~16 seconds.

## Common Startup Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| EADDRINUSE | Port already in use | Run port cleanup commands above |
| Docker daemon not running | Docker Desktop not started | Start Docker Desktop first |
| npm: command not found | Node.js not in PATH | Add Node.js to PATH or use full path |
| Todo App slow to start | Vue dev server startup | Wait full 10 seconds |

## Output Summary

After startup, display:
```
Workshop Demo Ready

| Service           | Port | Status |
|-------------------|------|--------|
| Todo App          | 3000 | [status] |
| Test Investigator | 3500 | [status] |
| MailHog           | 8025 | [status] |

Todo App Branch: master (working code)
AI Model: [selected-model]

What's Next:
  1. Run tests:  npx playwright test --reporter=json,html
     (Add --headed to watch browser: npx playwright test --headed)
  2. All tests should PASS (green) on master branch
  3. Switch to buggy branch:  /workshop-next-sprint
  4. Run tests again - they will FAIL
  5. Investigate failures:  /investigate

Other Commands:
  /verify                 # Check app state
  /workshop-end           # Stop services

URLs:
  Todo App:          http://localhost:3000
  MailHog:           http://localhost:8025
  Test Investigator: http://localhost:3500/api/health
  Jenkins:           http://localhost:5555
```
