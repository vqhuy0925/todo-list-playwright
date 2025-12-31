# kill-port.ps1 - Kill process listening on a specific port
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File kill-port.ps1 -Port 3000
#
# Parameters:
#   -Port  Required. The port number to free up.
#
# Common ports:
#   3000 - Todo App
#   3500 - Test Investigator
#   8025 - MailHog

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($connections) {
    foreach ($conn in $connections) {
        try {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process $($conn.OwningProcess) on port $Port"
        } catch {
            Write-Host "Failed to kill process: $_"
        }
    }
} else {
    Write-Host "No process on port $Port"
}
