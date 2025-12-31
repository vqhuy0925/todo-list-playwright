---
description: Jenkins operations (trigger build, check status, get logs)
argument-hint: <action> [build-number]
---

# Jenkins Operations

Interact with Jenkins CI server for the todo-list-playwright project.

## Arguments
`$ARGUMENTS`

## Actions

Parse the first argument to determine action:
- `trigger` or `build` - Trigger a new build
- `status` [build-number] - Check build status (default: last build)
- `log` <build-number> - Get console log for a build
- `wait` - Wait for current build to complete

## Configuration

- **Jenkins URL**: http://localhost:5555
- **Job Name**: todo-list-playwright
- **Credentials**: admin/pleaseCh@nge1t

## PowerShell Scripts

### Helper Scripts Location
The following scripts are available in the project root:

#### trigger-jenkins.ps1
Triggers a new Jenkins build with proper CSRF handling.
```powershell
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/trigger-jenkins.ps1"
```

#### check-jenkins.ps1
Check build status or get console logs.
```powershell
# Get last build status
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1"

# Get console log for specific build
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1" -BuildNumber 29
```

#### kill-port.ps1
Kill process on a specific port.
```powershell
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3000
```

## Implementation

### For `trigger` or `build`:
```bash
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/trigger-jenkins.ps1"
```

### For `status`:
```bash
# Without build number - gets last build
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1"

# With build number
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1" -BuildNumber <number>
```

### For `log`:
```bash
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1" -BuildNumber <number>
```

### For `wait`:
Poll status every 10 seconds until `building` is false:
```bash
# Loop until build completes
while true; do
  status=$(powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/check-jenkins.ps1")
  echo "$status"
  if [[ "$status" != *'"building":true'* ]]; then
    break
  fi
  sleep 10
done
```

## Output Format

After each operation, display a summary:

```
Jenkins Build Status
━━━━━━━━━━━━━━━━━━━━
Build:    #<number>
Status:   <SUCCESS|FAILURE|UNSTABLE|BUILDING>
URL:      http://localhost:5555/job/todo-list-playwright/<number>/

[For trigger] Build triggered successfully!
[For log] <last 50 lines of console output>
```

## Common Workflows

### Run tests and wait for result:
1. Trigger build: `/jenkins trigger`
2. Wait for completion: `/jenkins wait`
3. Check result: `/jenkins status`

### Debug a failed build:
1. Get status: `/jenkins status`
2. View logs: `/jenkins log <build-number>`
