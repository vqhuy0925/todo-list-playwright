# View AI Investigation Logs

Show the latest logs from the Test Investigator AI service with focus on the investigation journey.

## Instructions

1. Find the background task running the test-investigator-ai service
2. Read and display the latest log output
3. Highlight key information like:
   - Investigation requests (job name, build number)
   - Claude analysis attempts and results
   - MCP tool usage (browser actions)
   - **Investigation steps taken**
   - **Selectors attempted and results**
   - **DOM inspection findings**
   - Errors or timeouts

## Steps

```bash
# Find the investigator log file
# Look for recent task output files containing "test-investigator-ai" or "INVESTIGATE"

# Display last 100 lines of the log
# Parse and highlight:
# - [INVESTIGATE] entries
# - [CLAUDE] entries
# - [FETCH] entries
# - [EMAIL] entries
# - Errors and timeouts
```

## Investigation Journey Parsing

When displaying logs, look for and highlight these patterns:

### Step-by-Step Actions
```
Step 1: Navigate to app -> SUCCESS
Step 2: Locate task element -> SUCCESS
Step 3: Click checkbox -> SUCCESS
Step 4: Try selector 'div > div' -> FAIL (0 elements found)
Step 5: Inspect actual DOM -> INFO (found label > span structure)
Step 6: Try alternative 'span' -> SUCCESS (1 element found)
Step 7: Verify CSS property -> SUCCESS (line-through applied)
```

### Evidence Summary
```
DOM Structure Found: <label><span class="line-through">Go shopping</span></label>

Selectors Tested:
  [✗ NOT FOUND] div > div
  [✓ FOUND] span
  [✓ FOUND] label > span

CSS Verified:
  Property: text-decoration
  Expected: line-through
  Actual: line-through solid rgb(0, 0, 0)
  Match: YES
```

## Summary Report

Show a summary of:
- Total investigations processed
- Success/failure rate
- Average response time
- **Investigation depth** (avg steps per investigation)
- **Common selector issues found**
- Any errors or issues

## Example Output Format

```
╔════════════════════════════════════════════════════════════════╗
║           AI INVESTIGATION LOG SUMMARY                         ║
╠════════════════════════════════════════════════════════════════╣
║  Last Investigation: todo-list-playwright #34
║  Time: 47 seconds
║  Result: SUCCESS (TEST_ISSUE identified)
║
║  Investigation Journey:
║  1. [✓] Navigate to http://localhost:3000
║  2. [✓] Found task "Go shopping"
║  3. [✓] Clicked checkbox
║  4. [✗] Selector 'div > div' failed
║  5. [ℹ] Inspected DOM: label > span structure
║  6. [✓] Alternative 'span' works
║  7. [✓] CSS line-through verified
║
║  Conclusion: Test selector outdated, app works correctly
╚════════════════════════════════════════════════════════════════╝
```

If no logs found, check if the investigator service is running on port 3500.
