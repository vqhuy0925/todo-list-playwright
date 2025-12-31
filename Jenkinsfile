/**
 * Jenkins Pipeline for Playwright Tests with AI Investigation
 *
 * This pipeline:
 * 1. Runs Playwright tests
 * 2. On failure, triggers AI investigation API
 * 3. Publishes test reports
 *
 * Requirements:
 * - NodeJS plugin installed
 * - HTML Publisher plugin installed
 * - HTTP Request plugin installed
 * - Test Investigator AI service running
 *
 * Environment variables to configure:
 * - INVESTIGATOR_URL: URL of the Test Investigator AI service (default: http://localhost:3500)
 * - INVESTIGATOR_API_KEY: API key for authentication (optional)
 * - NOTIFICATION_EMAIL: Email for investigation results (optional)
 */

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

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat '''
                    if not exist "node_modules" (
                        npm ci --registry=https://registry.npmjs.org
                    ) else (
                        echo node_modules already exists, skipping install
                    )
                '''
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
                // CI=true is set in environment, so playwright.config.js will use
                // the CI reporter config which outputs junit to test-results/results.xml
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Archive artifacts for AI investigation (must be before cleanWs)
            archiveArtifacts(
                artifacts: 'playwright-report/**',
                allowEmptyArchive: true
            )

            // Publish HTML report for Jenkins UI
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
                testResults: 'test-results/results.xml',
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
 * Trigger AI Investigation for test failures
 */
def triggerAIInvestigation() {
    echo "=== Triggering AI Investigation ==="

    def reportUrl = "${env.BUILD_URL}artifact/playwright-report/report.json"

    def payload = [
        jobName: env.JOB_NAME,
        buildNumber: env.BUILD_NUMBER,
        branch: env.GIT_BRANCH ?: 'unknown',
        commit: env.GIT_COMMIT ?: 'unknown',
        reportUrl: reportUrl,
        emailTo: env.NOTIFICATION_EMAIL ?: ''
    ]

    def payloadJson = groovy.json.JsonOutput.toJson(payload)

    echo "Investigation payload: ${payloadJson}"

    try {
        def response

        if (env.INVESTIGATOR_API_KEY) {
            // With authentication
            response = httpRequest(
                url: "${env.INVESTIGATOR_URL}/api/investigate",
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: payloadJson,
                customHeaders: [
                    [name: 'Authorization', value: "Bearer ${env.INVESTIGATOR_API_KEY}"]
                ],
                validResponseCodes: '200:599',
                timeout: 300  // 5 min for MCP investigation
            )
        } else {
            // Without authentication
            response = httpRequest(
                url: "${env.INVESTIGATOR_URL}/api/investigate",
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: payloadJson,
                validResponseCodes: '200:599',
                timeout: 300  // 5 min for MCP investigation
            )
        }

        echo "Investigation API response: ${response.status}"

        if (response.status == 200) {
            def result = new groovy.json.JsonSlurper().parseText(response.content)

            if (result.success) {
                def analysis = result.investigation.analysis

                echo """
╔════════════════════════════════════════════════════════════╗
║               AI INVESTIGATION RESULTS                     ║
╠════════════════════════════════════════════════════════════╣
║  Category: ${analysis.overallCategory}
║  Priority: ${analysis.priority}
║  Confidence: ${(int)(analysis.confidence * 100)}%
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
            echo "Investigation API returned status ${response.status}: ${response.content}"
        }

    } catch (Exception e) {
        echo "Failed to trigger AI investigation: ${e.message}"
        echo "This is non-fatal - build continues with standard failure handling"
    }
}
