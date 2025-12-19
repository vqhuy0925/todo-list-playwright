# todo-list-playwright

This project contains a Playwright automation script for testing a To-Do application.

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