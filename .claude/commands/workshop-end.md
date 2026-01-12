---
description: Stop all workshop services and clean up
argument-hint: [-h|--help] [--keep-mailhog]
---

# Workshop End

Stop all workshop demo services gracefully.

## Arguments Received
`$ARGUMENTS`

## Help Mode

If arguments contain `-h` or `--help`, display this help and exit:

```
/workshop-end - Stop all workshop demo services

OPTIONS:
  -h, --help           Show this help message
  --keep-mailhog       Keep MailHog running (don't stop Docker container)

SERVICES STOPPED:
  Port 3000  - Todo App
  Port 3500  - Test Investigator API
  Port 8025  - MailHog (unless --keep-mailhog)

EXAMPLES:
  /workshop-end                    # Stop all services
  /workshop-end --keep-mailhog     # Keep MailHog for email inspection
  /workshop-end -h

RELATED COMMANDS:
  /workshop-start                  # Start all services
```

## Shutdown Procedure

### 1. Check Running Services
First, check which ports are in use:
```bash
netstat -ano | findstr ":3000 :3500 :8025"
```

### 2. Kill Node Processes on Ports

Use the helper script (works reliably from any shell):
```bash
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3000
powershell -ExecutionPolicy Bypass -File "C:/work/workshop/todo-list-playwright/kill-port.ps1" -Port 3500
```

### 3. Stop MailHog (unless --keep-mailhog)
If arguments do NOT contain `--keep-mailhog`:
```bash
docker stop mailhog
```

### 4. Verify Services Stopped
Check ports are free using PowerShell:
```powershell
# Returns nothing if ports are free
Get-NetTCPConnection -LocalPort 3000,3500 -ErrorAction SilentlyContinue
```

Or with bash:
```bash
netstat -ano | findstr ":3000 :3500"
```

## Common Shutdown Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Process not killed | PID changed or already dead | Run command again, it's safe |
| Permission denied | Running as different user | Run terminal as Administrator |
| Background task cleanup message | Claude Code task tracking | Normal - processes already stopped |
| Docker stop hangs | MailHog container stuck | Use `docker kill mailhog` instead |

## Note on "Background command was killed" Message

When running `/workshop-end` followed by `/exit`, you may see:
```
Background command "Start Todo App on port 3000" was killed.
```
This is **normal** - Claude Code is cleaning up its internal task tracking. The process was already terminated; this message just confirms the background task reference was cleaned up on exit.

## Output Summary

After shutdown, display:
```
Workshop Services Stopped

| Service           | Port | Status  |
|-------------------|------|---------|
| Todo App          | 3000 | Stopped |
| Test Investigator | 3500 | Stopped |
| MailHog           | 8025 | [Stopped/Running] |

To restart: /workshop-start
```
