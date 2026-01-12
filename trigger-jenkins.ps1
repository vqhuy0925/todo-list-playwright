# trigger-jenkins.ps1 - Trigger a Jenkins build with CSRF protection
#
# Usage: powershell -ExecutionPolicy Bypass -File trigger-jenkins.ps1
#
# Requirements:
#   - Jenkins running at http://localhost:5555
#   - Credentials: admin/pleaseCh@nge1t
#
# This script handles Jenkins CSRF crumb authentication properly by:
#   1. Creating a session to maintain cookies
#   2. Fetching CSRF crumb with the session
#   3. Using both session and crumb for the build request

$JenkinsUrl = "http://localhost:5555"
$JobName = "todo-list-playwright"
$Username = "admin"
$Password = "pleaseCh@nge1t"

$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${Password}"))
$baseHeaders = @{Authorization = "Basic $cred"}

# Create session to maintain cookies
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Get crumb with session
$crumbResponse = Invoke-WebRequest -Uri "$JenkinsUrl/crumbIssuer/api/json" -Headers $baseHeaders -WebSession $session -UseBasicParsing
$crumbJson = $crumbResponse.Content | ConvertFrom-Json
Write-Host "Got crumb: $($crumbJson.crumb)"

# Build headers with crumb
$buildHeaders = @{
    Authorization = "Basic $cred"
    $crumbJson.crumbRequestField = $crumbJson.crumb
}

# Trigger build with same session
$response = Invoke-WebRequest -Uri "$JenkinsUrl/job/$JobName/build" -Method POST -Headers $buildHeaders -WebSession $session -UseBasicParsing
Write-Host "Build triggered! Status: $($response.StatusCode)"
