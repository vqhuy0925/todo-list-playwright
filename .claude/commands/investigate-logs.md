# View AI Investigation Logs

Show the latest logs from the Test Investigator AI service.

## Instructions

1. Find the background task running the test-investigator-ai service
2. Read and display the latest log output
3. Highlight key information like:
   - Investigation requests (job name, build number)
   - Claude analysis attempts and results
   - MCP tool usage
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

Show a summary of:
- Total investigations processed
- Success/failure rate
- Average response time
- Any errors or issues

If no logs found, check if the investigator service is running on port 3500.
