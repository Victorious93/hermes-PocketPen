---
date: 2026-08-29
pr: 4
feature: Run-chat correctness fixes (token accounting, input guards, checkpoint cleanup, history-command gating)
impact: Assistant tool-call arguments are now counted toward context token usage (previously collapsed to "[object Object]"), so compression triggers at the intended threshold for tool-heavy turns instead of too late; the mid-run context estimate no longer double-counts the expanded prompt of /skill and /bundles runs; run input arrays beginning with a primitive no longer abort message handling; failed/aborted bridge runs release their workspace-diff snapshot buffers instead of leaking them; /compress and /clear --history now refuse to rewrite history while a bridge run is still live (matching /branch); and session message-formatting failures are logged instead of silently yielding an empty transcript.
---

Correctness and robustness fixes in the Chat session chain runtime:

- `run-chat/usage.ts`: `estimateUsageTokensFromMessages` serializes `tool_calls`
  with `JSON.stringify` instead of `String(...)`, restoring the argument payload
  to the token estimate that feeds `run-chat/compression.ts`.
- `run-chat/content-blocks.ts`: `isContentBlockArray` guards that the first
  element is a non-null object before `'type' in ...`, so a run input array whose
  first element is a string/number/null returns `false` rather than throwing.
- `run-chat/message-format.ts`: `handleMessage` logs any formatting error instead
  of swallowing it, so a session no longer silently renders as empty.
- `run-chat/handle-bridge-run.ts`: the mid-run context estimate keys
  `currentInputIncludedInDb` off the persisted `storageRole` rather than the
  display role, so commands that store an expanded prompt as a user-role DB row
  (`/skill`, `/bundles`) are no longer counted twice. The error and abort paths
  now call `discardWorkspaceRunCheckpoint`, releasing the run's snapshot buffers
  that previously leaked whenever a run did not reach the success/finalize path.
- `run-chat/session-command.ts`: `/compress` and `/clear --history` consult the
  live bridge run status (like `/branch`) before rewriting history, closing a
  reconnect race where local `isWorking` was `false` while a run was still in
  flight.
