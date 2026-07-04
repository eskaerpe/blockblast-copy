# OpenCode Project Guide — Reusable Setup

This folder documents the OpenCode configuration, skills, and MCP servers used in
this repo (and globally), so you can replicate the same setup for a new project.

---

## 1. Global Config (`~/.config/opencode/`)

| File | Purpose |
|------|---------|
| `opencode.jsonc` | MCP servers: Context7 (remote), Playwright (local), Chrome DevTools (local) |
| `AGENTS.md` | Instructions for using Context7 MCP (prefer over web search for lib docs) |
| `package.json` | Declares `@opencode-ai/plugin` dependency (installed locally in `.config/opencode/node_modules/`) |

### MCP Servers

| Server | Type | Command / URL |
|--------|------|--------------|
| `context7` | remote | `https://mcp.context7.com/mcp` (with API key) |
| `playwright` | local | `npx @playwright/mcp@latest` |
| `chrome-devtools` | local | `npx -y chrome-devtools-mcp@latest` |

**To install the plugin globally:**
```sh
cd ~\.config\opencode
npm install
```

---

## 2. Project-Level Skills & Config

### Skills lockfile: `skills-lock.json` (in project root)

Tracks installed skills. Current set:

| Skill | Source | Installed To |
|-------|--------|--------------|
| `emil-design-eng` | `emilkowalski/skill` | `.agents/skills/emil-design-eng/` |
| `review-animations` | `emilkowalski/skill` | `.agents/skills/review-animations/` |
| `frontend-design` | `anthropics/claude-code` | `.agents/skills/frontend-design/` |

### Custom skill (not from GitHub): `.opencode/skills/cs-study-module/`

A hand-authored skill for building single-file HTML study modules with MathJax,
dark mode, flashcards, quizzes, and search. Not installed via lockfile — placed
directly in `.opencode/skills/`.

### Installed skill (GitHub): `.agents/skills/react-study-module/`

Skill for building/editing the Vite + React study apps. This is the 4th skill
manually installed (not tracked in `skills-lock.json`).

### `.opencode/.gitignore`

Ignores `node_modules`, `package.json`, `package-lock.json`, `bun.lock`.

---

## 3. Repo-Level File Locations

```
~/.config/opencode/
├── opencode.jsonc          ← MCP config (copy to new project)
├── AGENTS.md               ← global agent instructions
├── package.json            ← @opencode-ai/plugin
├── package-lock.json
├── .gitignore
└── node_modules/           ← installed deps

<project-root>/
├── skills-lock.json        ← github-sourced skills manifest
├── AGENTS.md               ← per-project agent instructions
├── .opencode/
│   ├── .gitignore
│   ├── skills/
│   │   └── cs-study-module/  ← custom skill (hand-authored)
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
├── .agents/
│   └── skills/
│       ├── emil-design-eng/
│       ├── frontend-design/
│       ├── react-study-module/
│       └── review-animations/
```

---

## 4. How to Replicate for a New Project

```sh
# 1. Global config is already in ~/.config/opencode/ — no action needed

# 2. Create project-level OpenCode config
mkdir .opencode .agents .agents/skills

# 3. Install plugin (optional — only if needed by OpenCode)
cd .opencode
npm init -y
npm install @opencode-ai/plugin
cd ..

# 4. Install skills from GitHub (repeat for each skill)
opencode install-skill emilkowalski/skill:emil-design-eng
opencode install-skill emilkowalski/skill:review-animations
opencode install-skill anthropics/claude-code:frontend-design
opencode install-skill <some-source>:react-study-module

# 5. Copy custom skill (cs-study-module) from an existing project
#    Copy .opencode/skills/cs-study-module/ to the new project.

# 6. Copy AGENTS.md from existing project (adapt as needed)
```

---

## 5. AGENTS.md Instructions for Context7

The global `AGENTS.md` at `~/.config/opencode/AGENTS.md` configures how agents
use the Context7 MCP. It tells agents to:

1. Always start with `resolve-library-id` using library name + question
2. Pick the best match by name, description, snippet count, source reputation, benchmark
3. `query-docs` with the selected library ID
4. Answer using fetched docs

It explicitly says *not* to use Context7 for refactoring, scripts, debugging,
code review, or general programming concepts.

See the actual file at `~/.config/opencode/AGENTS.md`.
