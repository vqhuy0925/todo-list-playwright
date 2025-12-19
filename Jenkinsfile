pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = 'C:\\ProgramData\\Jenkins\\.jenkins\\tools\\playwright-browsers'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci --registry=https://registry.npmjs.org'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npx playwright test'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
