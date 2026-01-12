# check-jenkins.ps1 - Check Jenkins build status or get console logs
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File check-jenkins.ps1
#   powershell -ExecutionPolicy Bypass -File check-jenkins.ps1 -BuildNumber 30
#
# Parameters:
#   -BuildNumber  Optional. If provided, shows console log. If omitted, shows last build status.
#
# Output:
#   Without BuildNumber: JSON with {building, number, result}
#   With BuildNumber: Last 4000 chars of console log

param(
    [int]$BuildNumber = 0
)

$JenkinsUrl = "http://localhost:5555"
$JobName = "todo-list-playwright"
$Username = "admin"
$Password = "pleaseCh@nge1t"

$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${Password}"))
$headers = @{Authorization = "Basic $cred"}

if ($BuildNumber -eq 0) {
    # Get last build info
    $response = Invoke-WebRequest -Uri "$JenkinsUrl/job/$JobName/lastBuild/api/json?tree=number,result,building" -Headers $headers -UseBasicParsing
    Write-Host $response.Content
} else {
    # Get console log for specific build
    $log = (Invoke-WebRequest -Uri "$JenkinsUrl/job/$JobName/$BuildNumber/consoleText" -Headers $headers -UseBasicParsing).Content
    # Get last 4000 chars
    $start = [Math]::Max(0, $log.Length - 4000)
    Write-Host $log.Substring($start)
}
