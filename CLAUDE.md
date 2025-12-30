# Todo List Playwright Tests - Claude Code Instructions

## Project Overview
Playwright E2E tests for the Todo List Vue application. Used in the AI-assisted test investigation workshop.

## Architecture
- **Application**: `C:\work\workshop\todo-list` - Vue.js Todo app (port 3000)
- **Tests**: `C:\work\workshop\todo-list-playwright` - Playwright test suite
- **Investigator**: `C:\work\workshop\test-investigator-ai` - AI analysis service (port 3500)

## Quick Commands

### Run Tests
```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # UI mode
npx playwright test --reporter=json,html  # Generate reports
```

### Serve Reports
```bash
npx http-server playwright-report -p 8888 --cors
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
| Report Server | 8888 | http://localhost:8888 |
| Jenkins | 5555 | http://localhost:5555 |

## Starting Workshop Environment

```bash
# Terminal 1: Todo App
cd C:\work\workshop\todo-list && npm run dev

# Terminal 2: MailHog
docker start mailhog || docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog

# Terminal 3: Report Server
npx http-server playwright-report -p 8888 --cors

# Terminal 4: Test Investigator
cd C:\work\workshop\test-investigator-ai && CLAUDE_MODEL=haiku npm start
```

## Running Full Investigation

```bash
# 1. Run tests
npx playwright test --reporter=json,html

# 2. Trigger AI investigation
curl -X POST http://localhost:3500/api/investigate \
  -H "Content-Type: application/json" \
  -d '{"jobName":"todo-list-playwright","buildNumber":"1","branch":"main","commit":"abc123","reportUrl":"http://localhost:8888/report.json","emailTo":"your@email.com"}'

# 3. View email report at http://localhost:8025
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
- **Browsers Cache**: `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers`

## Workshop Cleanup

```cmd
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

### Report URL returns 404
Start the report server:
```bash
npx http-server playwright-report -p 8888 --cors
```

### Git "dubious ownership" error
```cmd
git config --global --add safe.directory C:/work/workshop/todo-list-playwright
```
