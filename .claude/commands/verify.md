# Verify App State

Quick verification of the Todo List app state using Playwright MCP.

## Arguments
- `$ARGUMENTS` - What to verify (optional). Examples:
  - `pending count is 3`
  - `task "Buy milk" exists`
  - `filter works correctly`
  - (empty = full app health check)

## Instructions

1. **Navigate** to http://localhost:3000 using Playwright MCP

2. **Capture current state**:
   - Take accessibility tree snapshot
   - Take screenshot
   - Count tasks, check states

3. **Verify** the requested condition (or do full health check):
   - Check pending task count
   - Verify task names and priorities
   - Test filter functionality
   - Confirm buttons are clickable

4. **Report** with clear PASS/FAIL:
   ```
   PASS: Pending count is 3 (found: 3)
   FAIL: Expected task "Buy milk" but not found
   ```

## Quick Commands

| Command | What it checks |
|---------|----------------|
| `/verify` | Full health check |
| `/verify pending count is 3` | Task count |
| `/verify add task works` | Add flow |
| `/verify filter High` | Priority filter |

## App Info
- URL: http://localhost:3000
- Current tasks can be viewed via A11y snapshot

Verification request:
$ARGUMENTS
