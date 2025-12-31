---
description: Start all workshop services (Todo App, MailHog, Report Server, Test Investigator)
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
  Port 8888  - Playwright Report Server

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

Execute these commands in order:

### 0. Clear Stale Processes (Prevent EADDRINUSE)
Before starting services, kill any stale processes on workshop ports:
```bash
# Kill any existing processes on workshop ports
netstat -ano | grep ":3000" | awk '{print $5}' | head -1 | xargs -I {} taskkill //PID {} //F 2>/dev/null || true
netstat -ano | grep ":3500" | awk '{print $5}' | head -1 | xargs -I {} taskkill //PID {} //F 2>/dev/null || true
netstat -ano | grep ":8888" | awk '{print $5}' | head -1 | xargs -I {} taskkill //PID {} //F 2>/dev/null || true
```

### 1. Start MailHog (Docker)
```bash
docker start mailhog
```
If container doesn't exist:
```bash
docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog
```

### 2. Start Todo App (Background)
```bash
cd C:/work/workshop/todo-list && npm run dev
```
Run in background mode.

### 3. Start Report Server (Background)
```bash
cd C:/work/workshop/todo-list-playwright && npx http-server playwright-report -p 8888 --cors
```
Run in background mode.

### 4. Start Test Investigator (Background)
Use the selected model:
```bash
cd C:/work/workshop/test-investigator-ai && set CLAUDE_MODEL=<selected-model> && npm start
```
Run in background mode.

### 5. Wait and Verify
Wait 8 seconds (Todo App Vue dev server is slowest to start), then verify each service with PowerShell.

**IMPORTANT:** Use `localhost` (not `127.0.0.1`) for verification - some services bind to IPv6 `[::1]` only, and `localhost` handles both IPv4 and IPv6.

```powershell
(Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5).StatusCode
(Invoke-WebRequest -Uri 'http://localhost:3500/api/health' -UseBasicParsing -TimeoutSec 5).StatusCode
(Invoke-WebRequest -Uri 'http://localhost:8025' -UseBasicParsing -TimeoutSec 5).StatusCode
(Invoke-WebRequest -Uri 'http://localhost:8888' -UseBasicParsing -TimeoutSec 5).StatusCode
```

If any verification fails, wait 3 more seconds and retry once before reporting failure.

## Output Summary

After startup, display:
```
Workshop Demo Ready

| Service           | Port | Status |
|-------------------|------|--------|
| Todo App          | 3000 | [status] |
| Test Investigator | 3500 | [status] |
| MailHog           | 8025 | [status] |
| Report Server     | 8888 | [status] |

AI Model: [selected-model]

Quick Commands:
  npx playwright test --reporter=json,html  # Run tests
  /investigate                              # Analyze failures
  /verify                                   # Check app state
  /workshop-end                             # Stop services
```
