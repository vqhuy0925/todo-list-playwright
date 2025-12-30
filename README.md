# Todo List Playwright Tests

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/vqhuy0925/todo-list-playwright)

Playwright E2E tests for the [Todo List application](https://github.com/vqhuy0925/todo-list). This project is used in the **AI-Assisted Test Investigation Workshop**.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Workshop Guide](#workshop-guide)
- [Jenkins Integration](#jenkins-integration)
- [Presentation](#presentation)
- [Related Projects](#related-projects)

## Setup

### Prerequisites
- Node.js 18+ installed
- Todo List app running on http://localhost:3000

### 1. Install Dependencies
```bash
npm install --registry=https://registry.npmjs.org
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Start Todo App
```bash
cd C:\work\workshop\todo-list
npm run dev
```

## Running Tests

### Run All Tests
```bash
npm test
# or
npx playwright test
```

### Run with UI Mode
```bash
npm run test:ui
# or
npx playwright test --ui
```

### Generate Reports
```bash
npx playwright test --reporter=json,html
```

### View HTML Report
```bash
npm run test:report
# or
npx playwright show-report
```

## Workshop Guide

This project demonstrates AI-assisted test failure investigation.

### Workshop Services

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Todo App | 3000 | http://localhost:3000 | Application under test |
| Test Investigator | 3500 | http://localhost:3500 | AI analysis API |
| MailHog | 8025 | http://localhost:8025 | Email capture |
| Report Server | 8888 | http://localhost:8888 | Serve test reports |
| Jenkins | 5555 | http://localhost:5555 | CI/CD pipeline |

### Starting Workshop Environment

```bash
# Terminal 1: Todo App
cd C:\work\workshop\todo-list && npm run dev

# Terminal 2: MailHog (Docker)
docker start mailhog || docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog

# Terminal 3: Report Server
npx http-server playwright-report -p 8888 --cors

# Terminal 4: Test Investigator AI
cd C:\work\workshop\test-investigator-ai && CLAUDE_MODEL=haiku npm start
```

### Demo Flow

1. **Run Tests** (should pass initially)
   ```bash
   npx playwright test --reporter=json,html
   ```

2. **Introduce Bug** - Modify todo-list app to break completion styling

3. **Run Tests Again** (will fail)
   ```bash
   npx playwright test --reporter=json,html
   ```

4. **Trigger AI Investigation**
   ```bash
   curl -X POST http://localhost:3500/api/investigate \
     -H "Content-Type: application/json" \
     -d '{"jobName":"todo-list-playwright","buildNumber":"1","branch":"main","commit":"abc123","reportUrl":"http://localhost:8888/report.json","emailTo":"your@email.com"}'
   ```

5. **View Results** at http://localhost:8025

### Test Structure

| Test | Description |
|------|-------------|
| `should display initial tasks` | Verify default tasks are shown |
| `should add a new task` | Test add task functionality |
| `should mark a task as complete` | Test checkbox + strikethrough styling |
| `should delete a task` | Test delete button |
| `should clear completed tasks` | Test clear completed button |
| `should clear all tasks` | Test clear all button |

## Jenkins Integration

### Prerequisites
1. Jenkins with NodeJS plugin installed
2. NodeJS installation named `NodeJS` in Global Tool Configuration
3. Todo List app accessible from Jenkins

### Setup
1. Create a new Pipeline job
2. Configure Pipeline from SCM (Git)
3. Set repository URL to this project
4. Jenkins will automatically use the `Jenkinsfile`

### Pipeline Stages
1. **Install Dependencies** - npm packages
2. **Install Playwright Browsers** - Chromium (skipped if cached)
3. **Run Tests** - Execute Playwright tests with JUnit reports

### Optimizations
- Browser caching at `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers`
- Skip download if cached (~280MB saved per build)

### Troubleshooting

**Git "dubious ownership" error:**
```cmd
git config --global --add safe.directory C:/work/workshop/todo-list-playwright
```

## Presentation

This project includes a Marp presentation (`presentation.md`).

### Preview Slides
```bash
npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --preview
```

### Generate PDF
```bash
npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --pdf --allow-local-files
```

### Export to HTML
```bash
npx --registry=https://registry.npmjs.org @marp-team/marp-cli presentation.md --html --allow-local-files
```

## Workshop Cleanup

After completing the workshop:

```cmd
:: Delete cached Playwright browsers (~280MB)
rmdir /s /q "C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers"

:: Delete Jenkins job (via Jenkins UI)
:: Go to http://localhost:5555/job/todo-list-playwright/ -> Delete Pipeline

:: Stop MailHog
docker stop mailhog && docker rm mailhog

:: Optional: Clean npm cache
npm cache clean --force
```

### Files Created During Workshop

| Location | Description | Size |
|----------|-------------|------|
| `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers` | Cached browsers | ~280MB |
| `C:\ProgramData\Jenkins\.jenkins\jobs\todo-list-playwright` | Job config | ~1MB |

## Related Projects

- [Todo List App](https://github.com/vqhuy0925/todo-list) - Application under test
- [Test Investigator AI](../test-investigator-ai) - AI analysis service

## License

MIT
