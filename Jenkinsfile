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
            // Requires CSP configuration - see CLAUDE.md for setup
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

    // JSON report for AI analysis (Jenkins artifact)
    def reportUrl = "${env.BUILD_URL}artifact/playwright-report/report.json"
    // HTML report for email links (Jenkins artifact - requires CSP configuration)
    def htmlReportUrl = "${env.BUILD_URL}artifact/playwright-report/index.html"

    def payload = [
        jobName: env.JOB_NAME,
        buildNumber: env.BUILD_NUMBER,
        branch: env.GIT_BRANCH ?: 'unknown',
        commit: env.GIT_COMMIT ?: 'unknown',
        reportUrl: reportUrl,
        htmlReportUrl: htmlReportUrl,
        emailTo: env.NOTIFICATION_EMAIL ?: 'team@workshop.local'
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
                timeout: 900  // 15 min buffer for MCP investigation
            )
        } else {
            // Without authentication
            response = httpRequest(
                url: "${env.INVESTIGATOR_URL}/api/investigate",
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: payloadJson,
                validResponseCodes: '200:599',
                timeout: 900  // 15 min buffer for MCP investigation
            )
        }

        echo "Investigation API response: ${response.status}"

        if (response.status == 200) {
            def result = new groovy.json.JsonSlurper().parseText(response.content)

            if (result.success) {
                def investigation = result.investigation
                def analysis = investigation.analysis
                def timing = investigation.timing ?: [investigationTimeSec: 0, estimatedManualTimeMin: 30, timeSavedMin: 29]

                // Extract quick fix info from first failure (if available)
                def quickFix = ''
                def fileLocation = ''
                if (analysis.failures && analysis.failures.size() > 0) {
                    def firstFailure = analysis.failures[0]
                    fileLocation = firstFailure.file ?: ''
                    def line = firstFailure.line ?: ''
                    if (fileLocation && line) {
                        fileLocation = "${fileLocation}:${line}"
                    }
                    // Build quick fix section if suggestedFix contains code-like content
                    def fix = firstFailure.suggestedFix
                    if (fix) {
                        def fixText = fix instanceof List ? fix.join('\n║    ') : fix
                        quickFix = """║
║  💡 QUICK FIX:
║    ${fixText}"""
                    }
                }

                // Priority emoji
                def priorityEmoji = [HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢'][analysis.priority] ?: '⚪'

                echo """
╔════════════════════════════════════════════════════════════════════════════╗
║                    AI INVESTIGATION RESULTS                                ║
╠════════════════════════════════════════════════════════════════════════════╣
║  ${priorityEmoji} Category: ${analysis.overallCategory}
║  Priority: ${analysis.priority}
║  Confidence: ${(int)(analysis.confidence * 100)}%
║
╠════════════════════════════════════════════════════════════════════════════╣
║  ⏱️  TIMING METRICS
║  Investigation Time: ${timing.investigationTimeSec} seconds
║  Estimated Manual Time: ${timing.estimatedManualTimeMin}+ minutes
║  Time Saved: ~${timing.timeSavedMin} minutes
║
╠════════════════════════════════════════════════════════════════════════════╣
║  🔍 ROOT CAUSE
║  ${analysis.rootCause}
${fileLocation ? "║\n║  📄 File: ${fileLocation}" : ''}
${quickFix}
║
╠════════════════════════════════════════════════════════════════════════════╣
║  ⚡ SUGGESTED ACTIONS
${analysis.suggestedActions.collect { "║  • ${it}" }.join('\n')}
║
╠════════════════════════════════════════════════════════════════════════════╣
║  🔗 LINKS
║  📊 Playwright Report: ${htmlReportUrl}
║  🏗️  Build: ${env.BUILD_URL}
╚════════════════════════════════════════════════════════════════════════════╝
"""

                // Add summary to build description with emoji
                currentBuild.description = "${priorityEmoji} [${analysis.overallCategory}] ${analysis.rootCause}"

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
