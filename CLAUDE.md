# Todo List Playwright Tests - Claude Code Instructions

## Project Overview
Playwright E2E tests for the Todo List Vue application. Used in the AI-assisted test investigation workshop.

## Architecture
- **Application**: `C:\work\workshop\todo-list` - Vue.js Todo app (port 3000)
- **Tests**: `C:\work\workshop\todo-list-playwright` - Playwright test suite
- **Investigator**: `C:\work\workshop\test-investigator-ai` - AI analysis service (port 3500)

## Workshop Slash Commands

### `/workshop-start` - Start All Services
```
/workshop-start              # Start with default model (haiku)
/workshop-start --model sonnet   # Use Sonnet model
/workshop-start --model opus     # Use Opus model
/workshop-start -h               # Show help
```

### `/workshop-end` - Stop All Services
```
/workshop-end                # Stop all services
/workshop-end --keep-mailhog # Keep MailHog running
/workshop-end -h             # Show help
```

### Other Commands
| Command | Description |
|---------|-------------|
| `/verify` | Verify app state with Playwright |
| `/investigate [report]` | Interactive AI investigation with browser (demo-friendly) |
| `/jenkins` | Trigger Jenkins build (automated flow with email) |
| `/investigate-logs` | View AI investigation logs |
| `/workshop-next-sprint` | Switch to new feature branch (tests will fail) |

## Manual Startup (Alternative)

If slash commands don't work, run these 3 commands:
```
1. docker start mailhog
2. cd C:/work/workshop/todo-list && npm run dev  (background)
3. cd C:/work/workshop/test-investigator-ai && set CLAUDE_MODEL=haiku && npm start  (background)
```

Verify with PowerShell: `(Invoke-WebRequest -Uri 'http://localhost:PORT' -UseBasicParsing).StatusCode`

## Quick Commands

### Run Tests
```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # UI mode
npx playwright test --reporter=json,html  # Generate reports
```

### View HTML Report
```bash
npx playwright show-report
```

### Presentation (Marp)
```bash
npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --preview
npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --pdf --allow-local-files
```

## Workshop Services
| Service | Port | URL |
|---------|------|-----|
| Todo App | 3000 | http://localhost:3000 |
| Test Investigator API | 3500 | http://localhost:3500 |
| MailHog Web UI | 8025 | http://localhost:8025 |
| Jenkins | 5555 | http://localhost:5555 |

## Starting Workshop Environment

```bash
# Terminal 1: Todo App
cd C:\work\workshop\todo-list && npm run dev

# Terminal 2: MailHog
docker start mailhog || docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog

# Terminal 3: Test Investigator
cd C:\work\workshop\test-investigator-ai && CLAUDE_MODEL=haiku npm start
```

## Test Structure

Tests in `tests/todo-app.spec.js`:
- `should display initial tasks` - Verify default tasks shown
- `should add a new task` - Add task functionality
- `should mark a task as complete` - Checkbox toggle + strikethrough
- `should delete a task` - Delete button
- `should clear completed tasks` - Clear completed button
- `should clear all tasks` - Clear all button

## CI/CD Integration
- **Jenkins URL**: http://localhost:5555
- **Job**: todo-list-playwright
- **Credentials**: admin / pleaseCh@nge1t
- **Browsers Cache**: `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers`

## Jenkins Helper Scripts

PowerShell scripts for Jenkins automation (handles CSRF crumb authentication):

### Trigger a Build
```powershell
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/trigger-jenkins.ps1"
```

### Check Build Status
```powershell
# Get last build status (JSON: building, number, result)
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1"

# Get console log for specific build (last 4000 chars)
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1" -BuildNumber 30
```

### Kill Process on Port
```powershell
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3000
```

## Jenkins CSP Configuration (Required for HTML Reports)

Playwright HTML reports require JavaScript. Jenkins CSP blocks this by default.

### Setup (One-time)
Edit `C:\Program Files\Jenkins\jenkins.xml` and add the CSP property to the `<arguments>` line:

**Before:**
```xml
<arguments>-Xrs -Xmx256m -Dhudson.lifecycle=hudson.lifecycle.WindowsServiceLifecycle -jar "C:\Program Files\Jenkins\jenkins.war" --httpPort=5555 --webroot="%ProgramData%\Jenkins\war"</arguments>
```

**After:**
```xml
<arguments>-Xrs -Xmx256m -Dhudson.lifecycle=hudson.lifecycle.WindowsServiceLifecycle -Dhudson.model.DirectoryBrowserSupport.CSP="sandbox allow-scripts allow-same-origin; default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';" -jar "C:\Program Files\Jenkins\jenkins.war" --httpPort=5555 --webroot="%ProgramData%\Jenkins\war"</arguments>
```

Then restart Jenkins:
```cmd
net stop jenkins
net start jenkins
```

### Cleanup After Workshop
To restore default Jenkins CSP security:
1. Remove `-Dhudson.model.DirectoryBrowserSupport.CSP="..."` from jenkins.xml
2. Restart: `net stop jenkins && net start jenkins`

### Alternative: Temporary (Script Console)
Go to `http://localhost:5555/script` and run:
```groovy
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "sandbox allow-scripts allow-same-origin; default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';")
```
(Resets on Jenkins restart)

## Workshop Cleanup

```cmd
:: Restore Jenkins CSP (remove the -D line from jenkins.xml and restart)

:: Delete cached Playwright browsers (~280MB)
rmdir /s /q "C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers"

:: Stop MailHog
docker stop mailhog && docker rm mailhog
```

## Playwright MCP Usage

When using Playwright MCP for browser automation, delegate to agents:

```
Task tool:
- subagent_type: "general-purpose"
- prompt: "Navigate to http://localhost:3000, take screenshot, verify UI elements"
```

## Common Issues

### Tests fail with "connection refused"
Ensure Todo app is running on port 3000:
```bash
cd C:\work\workshop\todo-list && npm run dev
```

### Port already in use (EADDRINUSE)
If a service fails to start with "address already in use" error, kill the process on that port:
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Git "dubious ownership" error
```cmd
git config --global --add safe.directory C:/work/workshop/todo-list-playwright
```

### Workshop startup timing issues
Services have different startup times. When verifying after `/workshop-start`:

| Service | Startup Time | Notes |
|---------|--------------|-------|
| MailHog | ~1s | Docker container, fastest |
| Test Investigator | ~2s | Node.js Express server |
| Todo App | ~8s | Vue dev server, **slowest** |

**Verification tips:**
- Wait at least 8 seconds before verifying all services
- Use `localhost` (not `127.0.0.1`) for verification - some services bind to IPv6 `[::1]` only
- If first verification fails, retry once after 3 more seconds

### /workshop-end cleanup message is normal
When running `/workshop-end` followed by `/exit`, you may see:
```
● Background command "Start Todo App on port 3000" was killed.
```
This is **normal** - Claude Code is cleaning up its internal task tracking.

### MCP Investigation Timeout
The AI investigation with Playwright MCP can take 1-2 minutes. Timeouts are configured:
- Claude CLI: 10 minutes (`CLAUDE_TIMEOUT_MS`)
- Jenkins httpRequest: 15 minutes (`timeout: 900`)

### Email Not Sent
If MailHog inbox is empty:
1. Check Test Investigator logs for `[EMAIL]` messages
2. Verify `emailTo` parameter is provided or `EMAIL_TO` env var is set
3. Check MailHog is running: http://localhost:8025

## Demo Checklist

### Before Demo
- [ ] Configure Jenkins CSP (see above) - **one-time setup**
- [ ] Start Docker Desktop
- [ ] Run `/workshop-start` and verify all 3 services are running
- [ ] Open http://localhost:8025 to verify MailHog is ready

### Demo Flow - Two Options

**Option A: Interactive Demo (Recommended for teaching)**
1. Run `npx playwright test` to generate report with failures
2. Run `/investigate` - watch AI navigate browser and discover issues
3. AI shows findings in human-readable format, takes screenshots

**Option B: Jenkins CI/CD Demo (Shows full integration)**
1. Trigger Jenkins build - http://localhost:5555/job/todo-list-playwright/build
2. Watch console output - AI Investigation Results box appears
3. Check email - http://localhost:8025 for investigation report
4. View HTML report - Click "Playwright Report" link in Jenkins

### Quick Recovery
If something goes wrong during demo:
```powershell
# Kill all workshop processes
Get-NetTCPConnection -LocalPort 3000,3500 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# Restart everything
/workshop-start
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_MODEL` | haiku | AI model (haiku/sonnet/opus) |
| `INVESTIGATOR_URL` | http://localhost:3500 | Test Investigator API URL |
| `NOTIFICATION_EMAIL` | team@workshop.local | Default email recipient |
