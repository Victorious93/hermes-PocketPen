<p align="center">
  <strong>PocketPentest AI Platform</strong>
  <a href="./README_zh.md">中文</a>
</p>

<p align="center">
  PocketPentest AI Platform is a lightweight, extensible penetration‑testing assistant built on Claude. This fork extends the original reconnaissance and vulnerability‑discovery features with modular scanner plugins, sandboxed execution for safe testing, CI/CD integration, configurable scan profiles, and flexible export formats (JSON/HTML) to streamline triage and remediation.
</p>

<p align="center">
  Quick start:
  <code>npm install -g pocketpentest && pocketpentest start</code>
  ·
  <a href="./docs">Documentation</a>
</p>

## Core Capabilities

| Area | What Hermes Studio does |
| --- | --- |
| Agent chat | Runs Hermes Agent conversations with streaming responses, tool traces, generated-file previews, persistent local sessions, and standalone desktop chat windows. |
| Local control plane | Manages profiles, providers, models, credentials, memory, skills, plugins, logs, and runtime settings from one dashboard. |
| Automation | Builds executable visual workflows and configures platform channels, cron jobs, Kanban tasks, group-chat rooms, and MCP servers around the same Hermes profiles. |
| Workspace tools | Provides a file browser, web terminal, Desktop Agent Browser, voice input/output, coding-agent runners, device discovery, Journey graph, and performance views. |
| Distribution | Ships as a desktop app for Windows/macOS/Linux, an npm CLI package, and a Docker image. |

## Features

### AI Chat

- Real-time chat streaming over Socket.IO `/chat-run`; chat runs execute through the Hermes agent bridge
- Multi-session management — create, rename, delete, switch between sessions
- **Self-built session database** — local SQLite storage for Web UI sessions; Hermes state.db remains a read-only source for Hermes history APIs
- Session grouping by source (Telegram, Discord, Slack, etc.) with collapsible accordion
- Active session indicator — live sessions pin to top with spinner icon
- Sessions sorted by latest message time
- Markdown rendering with syntax highlighting and code copy
- Tool call detail expansion (arguments / result)
- Profile-scoped file uploads, clipboard image/file paste, and workspace attachments
- File download support — download uploaded files and agent-generated files by resolved path across local, Docker, SSH, and Singularity backends
- Inline previews for generated HTML, PDF, DOCX, PPTX, XLSX, CSV, images, Markdown, and source files
- Session search — Ctrl+K search across the Web UI local session database; read-only Hermes history sessions are not included
- Session categories, message references, compression progress, and durable background delegation results
- Profile-aware model selector — discovers models available to the signed-in account through authorized Hermes profiles
- Per-session model display badge and context token usage

### Platform Channels

Unified configuration for **10 platforms** in one page:

| Platform      | Features                                                               |
| ------------- | ---------------------------------------------------------------------- |
| Telegram      | Bot token, mention control, reactions, free-response chats             |
| Discord       | Bot token, mention, auto-thread, reactions, channel allow/ignore lists |
| Slack         | Bot token, mention control, bot message handling                       |
| WhatsApp      | Enable/disable, mention control, mention patterns                      |
| Matrix        | Access token, homeserver, auto-thread, DM mention threads              |
| Feishu (Lark) | App ID / Secret, mention control                                       |
| DingTalk      | Client ID / Secret, mention control                                    |
| QQBot         | App ID / Secret, mention control                                       |
| WeChat        | QR code login (scan in browser, auto-save credentials)                 |
| WeCom         | Bot ID / Secret                                                        |

- Credential management writes to `~/.hermes/.env`
- Channel behavior settings write to `~/.hermes/config.yaml`
- Per-platform configured/unconfigured status detection

### Usage Analytics

- Total token usage breakdown (input / output)
- Session count with daily average
- Estimated cost tracking & cache hit rate
- Model usage distribution chart
- 30-day daily trend (bar chart + data table)

### Scheduled Jobs

- Create, edit, pause, resume, delete cron jobs
- Trigger immediate execution
- Cron expression quick presets

### Kanban

- Profile-aware Kanban board for planning and tracking agent work
- Task creation, updates, and status movement from the dashboard
- Shared with the same local Web UI state and authentication model

### Visual Workflows

- Vue Flow canvas for Hermes, Codex, and Claude Code nodes with file/image attachments
- Directed edges, structured conditions, success/failure routes, loops, and approval gates
- Import/export for portable workflow definitions and profile-aware workspaces
- Run budgets, deadlines, stop/rerun controls, and persisted execution history
- Frozen run snapshots, node conversations, edge decisions, and evidence playback on the canvas

### Model Management

- Auto-discover models from credential pool (`~/.hermes/auth.json`)
- Fetch available models from each provider endpoint (`/v1/models`)
- Add, update, and delete providers (preset and custom OpenAI-compatible)
- OAuth/device flows for OpenAI Codex, Nous Portal, xAI, Claude, and GitHub Copilot
- Provider URL auto-detection for non-v1 API versions (e.g. `/v4`)
- Provider-level model grouping, visible-model controls, aliases, refresh, and default switching
- Separate STT and TTS provider catalogs under Models

### Multi-Profile

- Create, rename, delete, and switch between Hermes profiles
- Clone existing profile or import from archive (`.tar.gz`)
- Export profile for backup or sharing
- Profile-scoped configuration, cache, uploads, sessions, jobs, usage, memory, skills, plugins, providers, and model visibility
- Account-bound profile access: super administrators can manage every profile; regular administrators only see and use profiles assigned to their account

### File Browser

- Browse files on remote backends (local, Docker, SSH, Singularity)
- Upload, download, rename, copy, move, and delete files
- Store uploaded files under the selected/requested Hermes profile while keeping downloads path-based for agent-generated artifacts outside the upload directory
- Create directories
- Preview and edit supported files with syntax highlighting, then attach workspace files back to a chat

### Group Chat

- Multi-agent chat rooms with real-time messaging via Socket.IO
- @mention routing — mention an agent to trigger a contextual reply
- Context compression — automatic conversation summarization when history exceeds token threshold
- Typing status and reply progress indicators
- Room creation, deletion, and invite code management
- Agent management — add/remove agents from rooms with per-agent profiles
- SQLite message persistence
- Mobile responsive with collapsible sidebar

### Coding Agents

- Install, configure, launch, and monitor Claude Code and Codex from the dashboard
- Built-in coding-agent terminal, session history, workspace selection, images, and file diffs
- Dedicated proxy routes and API modes for provider/model compatibility
- Standalone desktop chat windows and persisted output/reasoning metadata

### Desktop Agent Browser

- Desktop-only multi-tab browser that agents can navigate through the managed MCP server
- Isolated browser profiles, per-tab control leases, proxy settings, downloads, cookies, and permissions
- Accessibility snapshots, screenshots, console logs, and page annotations for agent-assisted browsing

### Skills & Memory

- Browse and search installed skills
- View skill details and attached files
- Install and manage Skill Bundles with profile-aware usage statistics
- User notes, persistent Ekko Agent memory, and profile-scoped memory management
- Interactive Journey graph for skill/memory relationships, category filtering, detail inspection, and playback

### Theme Customization

- Light/dark mode, interface style, base font size, text color, and active color
- Per-account background images and live preview across the workspace

### Logs

- View agent / server / error logs
- Filter by log level, log file, and keyword
- Structured log parsing with HTTP access log highlighting

### Admin & Runtime Management

- Device and LAN peer views for local-network discovery and peer tooling
- MCP manager for the managed `hermes-studio` server, profile injection, and `api` / `browser` / `devices` / `use` toolsets
- Runtime version and version-preview tooling for testing newer builds in isolation
- Performance monitor views for super administrators

### Authentication

- Token-based auth (auto-generated on first run or set via `AUTH_TOKEN` env var)
- Username/password login with account management in Settings
- Default bootstrap credentials are `admin` / `123456`; users are prompted after login to change the default username and password
- Super administrators can manage users and profile bindings; regular administrators can manage their own account details

CLI maintenance commands:

```bash
# Delete persisted login IP lock records
hermes-web-ui clear-login-locks

# Delete login locks and restart the running Web UI process
hermes-web-ui clear-login-locks --restart

# Create or reset the default super administrator login to admin / 123456
hermes-web-ui reset-default-login
```

`clear-login-locks` removes `${HERMES_WEB_UI_HOME:-~/.hermes-web-ui}/.login-lock.json`. If the server is running, restart it to clear in-memory lock state. `reset-default-login` updates the Web U[...]