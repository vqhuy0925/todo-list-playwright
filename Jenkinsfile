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
                // Get timing from API response, with AI-calculated estimate fallback
                def apiTiming = investigation.timing ?: [:]
                def aiTiming = analysis.timing ?: [:]

                // Prefer AI-calculated manual time estimate over hardcoded default
                def estimatedManual = aiTiming.estimatedManualTimeMin ?: apiTiming.estimatedManualTimeMin ?: 30
                def investigationSec = apiTiming.investigationTimeSec ?: 0
                def timeSaved = Math.max(0, estimatedManual - Math.ceil(investigationSec / 60))

                def timing = [
                    investigationTimeSec: investigationSec,
                    estimatedManualTimeMin: estimatedManual,
                    timeSavedMin: timeSaved
                ]

                // Priority emoji
                def priorityEmoji = [HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢'][analysis.priority] ?: '⚪'
                def resultIcons = [SUCCESS: '✓', FAIL: '✗', INFO: 'ℹ', WARN: '⚠']

                // Build per-failure sections (each failure has its own investigation journey)
                def failuresSection = ''
                def failures = analysis.failures ?: []

                failures.eachWithIndex { failure, idx ->
                    def failureNum = idx + 1
                    def fileLocation = failure.file ?: ''
                    def line = failure.line ?: ''
                    if (fileLocation && line) {
                        fileLocation = "${fileLocation}:${line}"
                    }

                    // Build suggested fix section
                    def fixText = ''
                    def fix = failure.suggestedFix
                    if (fix) {
                        fixText = fix instanceof List ? fix.collect { "║      • ${it}" }.join('\n') : "║      ${fix}"
                    }

                    // Build per-failure investigation journey (3-column format)
                    def journeySteps = failure.investigationJourney ?: []
                    def journeyText = ''
                    if (journeySteps.size() > 0) {
                        // Add header row
                        journeyText = "║   #  Result  Action                              Tool/Code\n"
                        journeyText += "║   ─────────────────────────────────────────────────────────────\n"
                        journeyText += journeySteps.collect { step ->
                            def icon = resultIcons[step.result] ?: '?'
                            def tool = step.tool ?: ''
                            def code = step.code ?: ''
                            def toolCode = tool ? "[${tool}] ${code}".take(30) : ''
                            "║   ${step.step}.  [${icon}]   ${step.action.take(40).padRight(40)} ${toolCode}"
                        }.join('\n')
                    }

                    // Build evidence section for this failure
                    def evidence = failure.evidence ?: [:]
                    def evidenceText = ''
                    if (evidence.selectorsAttempted) {
                        evidenceText = evidence.selectorsAttempted.collect { s ->
                            def found = s.found ? '✓' : '✗'
                            "║        ${found} ${s.selector}"
                        }.join('\n')
                    }

                    failuresSection += """║
╠────────────────────────────────────────────────────────────────────────────╣
║  📋 FAILURE #${failureNum}: ${failure.testName}
║  📄 ${fileLocation}
║  🏷️  Category: ${failure.category}
║
║  ❌ CAUSE: ${failure.cause}
║
║  💡 SUGGESTED FIX:
${fixText}
${journeyText ? """║
║  🔬 INVESTIGATION JOURNEY:
${journeyText}""" : ''}${evidenceText ? """║
║  📸 SELECTORS TESTED:
${evidenceText}""" : ''}"""
                }

                echo """
╔════════════════════════════════════════════════════════════════════════════╗
║                    AI INVESTIGATION RESULTS                                ║
╠════════════════════════════════════════════════════════════════════════════╣
║  ${priorityEmoji} Category: ${analysis.overallCategory}
║  Priority: ${analysis.priority}
║  Confidence: ${(int)(analysis.confidence * 100)}%
║  Failures: ${failures.size()}
║
╠════════════════════════════════════════════════════════════════════════════╣
║  ⏱️  TIMING METRICS
║  Investigation Time: ${timing.investigationTimeSec} seconds
║  Estimated Manual Time: ${timing.estimatedManualTimeMin}+ minutes
║  Time Saved: ~${timing.timeSavedMin} minutes
║
╠════════════════════════════════════════════════════════════════════════════╣
║  🔍 ROOT CAUSE SUMMARY
║  ${analysis.rootCause}
${failuresSection}
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
                currentBuild.description = "${priorityEmoji} [${analysis.overallCategory}] ${failures.size()} failure(s) - ${analysis.rootCause}"

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
