# todo-list-playwright

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/vqhuy0925/todo-list-playwright)

This project contains Playwright E2E tests for the [Todo List application](https://github.com/vqhuy0925/todo-list).

## Setup Instructions

To set up the project and run the automation script, follow these steps:

1.  **Ensure Node.js is installed:** If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

2.  **Initialize Node.js project (if not already done):**
    ```bash
    npm init -y
    ```

3.  **Install dependencies:**
    ```bash
    npm install --registry=https://registry.npmjs.org
    ```

4.  **Install Playwright Browsers:**
    ```bash
    npx playwright install
    ```

5.  **Configure for ES Modules:** Ensure your `package.json` has `"type": "module"` and the test scripts:
    ```json
    {
      "type": "module",
      "scripts": {
        "test": "npx playwright test",
        "test:ui": "npx playwright test --ui",
        "test:report": "npx playwright show-report"
      },
      "dependencies": {
        "playwright": "^1.57.0"
      },
      "devDependencies": {
        "@playwright/test": "^1.57.0"
      }
    }
    ```

## Running Tests

Before running tests, ensure your To-Do application is running on `http://localhost:3000/`.

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View HTML report
```bash
npm run test:report
```

## Test Structure

The test suite (`tests/todo-app.spec.js`) covers:
- Initial state verification
- Adding a new task
- Marking a task as complete
- Deleting a task
- Clear completed tasks
- Clear all tasks

## Jenkins Integration

This project includes a `Jenkinsfile` for CI/CD integration.

### Prerequisites
1. Jenkins with NodeJS plugin installed
2. Configure a NodeJS installation named `NodeJS` in Jenkins Global Tool Configuration
3. Ensure the Todo List app is accessible from Jenkins

### Setup in Jenkins
1. Create a new Pipeline job
2. Configure Pipeline from SCM (Git)
3. Set the repository URL to this project
4. Jenkins will automatically use the `Jenkinsfile`

### Pipeline Stages
- **Install Dependencies** - Installs npm packages
- **Install Playwright Browsers** - Downloads Chromium (skipped if cached)
- **Run Tests** - Executes Playwright tests with JUnit reports

### Pipeline Optimizations
- **Browser Caching** - Browsers cached in `C:\ProgramData\Jenkins\.jenkins\tools\playwright-browsers` (~280MB saved per build)
- **Skip Install Check** - Skips browser download if already cached
- **Build Time** - ~1 min with cached browsers vs ~2 min on first run

### Reports
- **JUnit Report** - Test results integrated with Jenkins test tracking

### Troubleshooting

#### Git "dubious ownership" error on Windows
If Jenkins runs as `NT AUTHORITY\SYSTEM` and fails with a Git ownership error, run this in an **Administrator Command Prompt**:
```cmd
git config --global --add safe.directory C:/work/workshop/todo-list-playwright
```

This adds the repository as a safe directory for the SYSTEM user.

## Related Repositories

- [Todo List App](https://github.com/vqhuy0925/todo-list) - The application under test