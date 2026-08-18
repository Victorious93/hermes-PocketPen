# Kali Tools Integration (Scaffold)

This is an initial, safe scaffold that adds a registry of the top-20 Kali tools (including Social-Engineer Toolkit (SET) and BeEF), a mocked runner, a minimal API, and two simple Vue UI pages to explore the catalog and perform simulated runs.

Important notes
- All execution is mocked. No real Kali tools are executed by these changes.
- Real execution must be implemented by a sandboxed runner (recommended: Docker), with strict RBAC and audit logging.
- Tools marked as "high" risk should be gated behind admin permission and explicit consent.

Files added
- packages/server/src/tools/catalog.ts — tools registry (top 20, incl. set, beef)
- packages/server/src/tools/runner.mock.ts — a mock runner that simulates runs
- packages/server/src/routes/tools.ts — express route skeleton for listing tools and running jobs (mocked)
- packages/client/src/views/ToolsList.vue — basic UI list
- packages/client/src/views/ToolDetail.vue — basic UI to run a tool (mocked)

Next steps (suggested)
1. Implement a Docker-based runner (kali-tools-runner image) that executes tools inside an isolated container.
2. Add RBAC checks and feature flags to prevent accidental or unauthorized runs.
3. Add parsers for common outputs (nmap XML, sqlmap JSON, nikto text) and an artifacts store (S3 or local with retention policy).
4. Add scheduling, playbooks, and websocket log streaming.

If you want, I can now:
- open a draft PR from this branch and include implementation notes and security checklists, or
- implement the Docker runner next (requires decisions about runtime environment and admin controls).
