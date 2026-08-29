---
date: 2026-08-29
pr: 4
feature: Run-chat token accounting and input-guard fixes
impact: Assistant tool-call arguments are now counted toward context token usage (previously collapsed to "[object Object]"), so compression triggers at the intended threshold for tool-heavy turns instead of too late; run input arrays that begin with a primitive no longer abort message handling; and session message-formatting failures are now logged instead of silently yielding an empty transcript.
---

Correctness and robustness fixes in the Chat session chain runtime:

- `run-chat/usage.ts`: `estimateUsageTokensFromMessages` serializes `tool_calls`
  with `JSON.stringify` instead of `String(...)`, restoring the argument payload
  to the token estimate that feeds `run-chat/compression.ts`.
- `run-chat/content-blocks.ts`: `isContentBlockArray` guards that the first
  element is a non-null object before `'type' in ...`, so a run input array whose
  first element is a string/number/null returns `false` rather than throwing.
- `run-chat/message-format.ts`: `handleMessage` logs any formatting error instead
  of swallowing it, so a session no longer silently renders as empty with no
  diagnostic. No change to successful message-loading behavior.
