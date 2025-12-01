# todo-list-playwright

This project contains a Playwright automation script for testing a To-Do application.

## Setup Instructions

To set up the project and run the automation script, follow these steps:

1.  **Ensure Node.js is installed:** If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

2.  **Initialize Node.js project (if not already done):**
    ```bash
    npm init -y
    ```

3.  **Install Playwright:**
    ```bash
    npm install playwright
    ```

4.  **Install Playwright Browsers:**
    ```bash
    npx playwright install
    ```

5.  **Configure for ES Modules:** Add "type": "module" to your `package.json` file. It should look something like this:
    ```json
    {
      "name": "todo-list-playwright",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "type": "module",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "playwright": "^1.x.x"
      }
    }
    ```

## Running the Script

Before running the script, ensure your To-Do application is running on `http://localhost:3000/`.

To execute the automation script, run the following command:

```bash
node tests/basic-automation.js
```

This will launch a browser (Chromium by default), navigate to the To-Do application, and perform a series of automated tests.