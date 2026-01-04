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

**Option A: PowerShell (Recommended for Windows)**
```powershell
# Kill processes on workshop ports (safe - ignores if not found)
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3500 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
```

**Option B: Git Bash / MSYS2**
```bash
# Kill process on port 3000
netstat -ano | grep ":3000" | awk '{print $5}' | head -1 | xargs -I {} taskkill //PID {} //F 2>/dev/null || true

# Kill process on port 3500
netstat -ano | grep ":3500" | awk '{print $5}' | head -1 | xargs -I {} taskkill //PID {} //F 2>/dev/null || true
```

Note: Use `//PID` and `//F` (double slashes) for taskkill in Git Bash to avoid path conversion issues.

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
