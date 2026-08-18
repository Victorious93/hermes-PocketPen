# Kali Tools Integration (Scaffold)

This is an initial, safe scaffold that adds a registry of the top-20 Kali tools (including Social-Engineer Toolkit (SET) and BeEF), a mocked runner, a minimal API, and two simple Vue UI pages to explore the catalog and perform simulated runs.

Important notes
- By default the server uses a MOCKED runner. To enable real, sandboxed execution via Docker, set the environment variable ENABLE_TOOL_EXECUTION=true.
- High-risk tools (risk: "high") are blocked unless ALLOW_HIGH_RISK=true is also set. This protects accidental dangerous runs.
- The Docker runner binds a job-specific artifact directory under KALI_ARTIFACT_ROOT (default /tmp/kali-tool-artifacts) so outputs may be inspected.
- Docker image used for execution is configured via KALI_RUNNER_IMAGE (default: kalilinux/kali-rolling:latest). You should provide a curated image in production that contains only the tools you support.

Environment variables
- ENABLE_TOOL_EXECUTION=false (default) — when true, the server will attempt to run tools inside Docker.
- ALLOW_HIGH_RISK=false (default) — when true, high-risk tools may also run; otherwise they are rejected.
- KALI_RUNNER_IMAGE=your-registry/your-kali-image:tag — the Docker image used to run tools.
- KALI_ARTIFACT_ROOT=/path/to/artifacts — root directory for per-job artifacts.
- KALI_RUN_TIMEOUT_MS=120000 — per-job timeout in milliseconds.

Security
- The docker runner intentionally disables network access (--network none) and applies resource limits. However, running penetration tools has serious security and legal implications. Only enable real execution in controlled environments with appropriate authorization and auditing.
- Prefer running this worker on an isolated host or in an air-gapped environment.

Next steps (recommended)
- Create a minimal curated Docker image containing only the Kali tools you need, and push it to a private registry. Reference it with KALI_RUNNER_IMAGE.
- Add RBAC checks integrated with your auth system so only specific users/groups can create jobs.
- Add WebSocket streaming for live tool logs and persistent artifact storage (S3 or internal storage with retention policies).
- Add per-tool allowlist/denylist and argument validation rules for stricter security.
