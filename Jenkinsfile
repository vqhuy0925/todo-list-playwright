pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = 'C:\\ProgramData\\Jenkins\\.jenkins\\tools\\playwright-browsers'
        // Test Investigator AI configuration
        INVESTIGATOR_URL = "${env.INVESTIGATOR_URL ?: 'http://localhost:3500'}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci --registry=https://registry.npmjs.org'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat '''
                    if not exist "%PLAYWRIGHT_BROWSERS_PATH%\\chromium-*" (
                        npx playwright install chromium
                    ) else (
                        echo Playwright browsers already cached, skipping download
                    )
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npx playwright test --reporter=html,json,junit'
            }
        }
    }

    post {
        always {
            // Publish HTML report
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])

            // Publish JUnit results
            junit(
                testResults: '**/test-results/**/*.xml',
                allowEmptyResults: true
            )
        }

        unstable {
            script {
                triggerAIInvestigation()
            }
        }

        failure {
            script {
                triggerAIInvestigation()
            }
        }

        cleanup {
            cleanWs()
        }
    }
}

/**
 * Trigger AI Investigation for test failures using curl
 */
def triggerAIInvestigation() {
    echo "=== Triggering AI Investigation ==="

    def reportUrl = "${env.BUILD_URL}artifact/playwright-report/index.html"
    def branch = env.GIT_BRANCH ?: 'unknown'
    def commit = env.GIT_COMMIT ?: 'unknown'
    def emailTo = env.NOTIFICATION_EMAIL ?: ''

    echo "Report URL: ${reportUrl}"

    try {
        // Write payload to a temp file to avoid escaping issues
        writeFile file: 'investigation-payload.json', text: """{
            "jobName": "${env.JOB_NAME}",
            "buildNumber": "${env.BUILD_NUMBER}",
            "branch": "${branch}",
            "commit": "${commit}",
            "reportUrl": "${reportUrl}",
            "emailTo": "${emailTo}"
        }"""

        // Use curl to call the API
        def curlCmd = "curl -s -X POST \"${env.INVESTIGATOR_URL}/api/investigate\" -H \"Content-Type: application/json\" -d @investigation-payload.json -o investigation-response.json -w \"%%{http_code}\""

        def statusCode = bat(script: curlCmd, returnStdout: true).trim()
        // Extract just the status code (last 3 characters)
        statusCode = statusCode.tokenize('\n').last().trim()

        echo "Investigation API response status: ${statusCode}"

        if (statusCode == '200' && fileExists('investigation-response.json')) {
            def responseText = readFile('investigation-response.json')
            def result = readJSON(text: responseText)

            if (result.success) {
                def analysis = result.investigation.analysis

                echo """
╔════════════════════════════════════════════════════════════╗
║               AI INVESTIGATION RESULTS                     ║
╠════════════════════════════════════════════════════════════╣
║  Category: ${analysis.overallCategory}
║  Priority: ${analysis.priority}
║  Confidence: ${Math.round(analysis.confidence * 100)}%
║
║  Root Cause:
║  ${analysis.rootCause}
║
║  Suggested Actions:
${analysis.suggestedActions.collect { "║  - ${it}" }.join('\n')}
╚════════════════════════════════════════════════════════════╝
"""

                // Add summary to build description
                currentBuild.description = "[${analysis.overallCategory}] ${analysis.rootCause}"

            } else {
                echo "Investigation failed: ${result.error}"
            }
        } else {
            echo "Investigation API returned status ${statusCode}"
            if (fileExists('investigation-response.json')) {
                echo "Response: ${readFile('investigation-response.json')}"
            }
        }

    } catch (Exception e) {
        echo "Failed to trigger AI investigation: ${e.message}"
        echo "This is non-fatal - build continues with standard failure handling"
    }
}
