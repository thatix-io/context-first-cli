# Context-First CLI

> A universal CLI for managing Context-First development methodology across any project ecosystem.

Orchestrate multi-repository workflows, create isolated feature workspaces, and maintain consistency for both human developers and AI agents.

[![npm version](https://img.shields.io/npm/v/context-first-cli.svg)](https://www.npmjs.com/package/context-first-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Why Context-First CLI?](#why-context-first-cli)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Installation](#installation)
- [Commands](#commands)
- [Workflow Guide](#workflow-guide)
- [Docker Support](#docker-support)
- [Architecture](#architecture)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Why Context-First CLI?

**The Problem**: Managing multiple repositories, coordinating feature development, and maintaining consistent processes across teams is complex and error-prone.

**The Solution**: Context-First CLI provides:

✅ **Isolated Feature Workspaces** - Work on multiple features simultaneously without conflicts  
✅ **Git Worktree Integration** - Efficient branch management without re-cloning repositories  
✅ **Docker Support** - Automatic `docker-compose.yml` generation with dynamic ports  
✅ **AI-Ready** - Pre-configured command templates for multiple AI providers (Claude, Cursor, Windsurf)  
✅ **Cross-Platform** - Works on Windows, macOS, and Linux  
✅ **Project-Agnostic** - One CLI for all your projects

---

## Quick Start

```bash
# 1. Install globally
npm install -g context-first-cli

# 2. Create orchestrator (project control center)
npx context-first-cli@latest create:orchestrator

# 3. Configure local environment
cd your-orchestrator/
npx context-first-cli@latest config:setup

# 4. Add repositories
npx context-first-cli@latest add:repo

# 5. Start working on a feature
npx context-first-cli@latest feature start FIN-123

# 6. Enter workspace and start services
cd .sessions/FIN-123
docker-compose up -d
```

**That's it!** You now have an isolated workspace with all repositories checked out and services running.

---

## Core Concepts

### 1. Orchestrator Repository

The **single source of truth** for your project's development process.

**Contains**:
- `context-manifest.json` - Repository definitions and relationships
- `.claude/commands/` (or `.cursor/`, `.windsurf/`, `.ai/`) - AI command templates
- `ai.properties.md` - Local configuration (gitignored)
- `.contextrc.json` - Makes orchestrator self-aware

**Purpose**: Define your development methodology once, use everywhere.

### 2. Feature Workspaces

**Isolated environments** for each feature you work on.

**Location**: `orchestrator/.sessions/<ISSUE-ID>/`

**Contains**:
- Git worktrees for each repository (efficient, no re-cloning)
- `docker-compose.yml` with dynamic ports
- Feature-specific documentation

**Benefits**:
- Work on multiple features simultaneously
- No port conflicts (FIN-11 → 3011, FIN-12 → 3012)
- Clean separation of concerns

### 3. Git Worktree

**Efficient branch management** without multiple clones.

**How it works**:
```
Main Repository (~/dev/backend):
└── main branch

Workspace 1 (.sessions/FIN-11/backend):
└── feature/FIN-11 branch (worktree)

Workspace 2 (.sessions/FIN-12/backend):
└── feature/FIN-12 branch (worktree)
```

**All share the same `.git/`** - saving disk space and time.

---

## Installation

### Global Installation (Recommended)

```bash
npm install -g context-first-cli
```

### Use Without Installing

```bash
npx context-first-cli@latest <command>
```

### Requirements

- Node.js >= 18.0.0
- Git >= 2.5.0
- Docker (optional, for container support)

---

## Commands

### Setup Commands

| Command | Description |
|---------|-------------|
| `create:orchestrator` | Create new orchestrator repository |
| `config:setup` | Configure local environment (`ai.properties.md`) |
| `add:repo` | Add repository to manifest |
| `add:repo-metaspec` | Add MetaSpecs repository |
| `init` | Initialize Context-First in existing project |

### Workspace Commands

| Command | Description |
|---------|-------------|
| `feature start <id>` | Create isolated workspace with worktrees |
| `feature list` | List all active workspaces |
| `feature switch <id>` | Get command to switch workspace |
| `feature add-repo <id>` | Add repositories to existing workspace |
| `feature merge <id>` | Merge feature and clean up |
| `feature end <id>` | Clean up workspace without merging |

### Utility Commands

| Command | Description |
|---------|-------------|
| `status` | Show workspace status |
| `doctor` | Check environment health |
| `update:commands` | Update AI command templates |

---

## Workflow Guide

### Initial Setup (Once Per Project)

#### Step 1: Create Orchestrator

```bash
npx context-first-cli@latest create:orchestrator
```

**Prompts**:
- Project name
- Description
- MetaSpecs repository URL (optional)

**Creates**:
```
my-project-orchestrator/
├── .contextrc.json
├── context-manifest.json
├── .claude/commands/
└── ai.properties.md (template)
```

#### Step 2: Configure Local Environment

```bash
cd my-project-orchestrator/
npx context-first-cli@latest config:setup
```

**Prompts**:
- `base_path`: Where your repositories live (e.g., `~/dev`)
- `auto_clone`: Automatically clone missing repos?
- Task manager: Jira, Linear, GitHub, or none

**Creates**: `ai.properties.md` with your local settings

#### Step 3: Add Repositories

```bash
npx context-first-cli@latest add:repo
```

**Prompts**:
- Repository folder name (e.g., `backend`)
- Git URL
- Role: `backend`, `frontend`, `metaspecs`, or `other`
- Description

**Repeat** for each repository in your project.

#### Step 4: Commit Orchestrator

```bash
git add .
git commit -m "feat: setup orchestrator"
git remote add origin <your-orchestrator-repo-url>
git push -u origin main
```

---

### Daily Development

#### Start Feature

```bash
# From orchestrator directory
npx context-first-cli@latest feature start FIN-123
```

**What happens**:
1. Creates `.sessions/FIN-123/`
2. Creates git worktrees for each repo
3. Generates `docker-compose.yml` with ports 3123, 8123, 5523, 6423
4. Ready to work!

#### Enter Workspace

```bash
cd .sessions/FIN-123
```

#### Start Services (Optional)

```bash
docker-compose up -d
```

**Access**:
- Backend: `http://localhost:3123`
- Frontend: `http://localhost:8123`
- Postgres: `localhost:5523`
- Redis: `localhost:6423`

#### Add Repositories (If Needed)

If you realize you need additional repositories after starting:

```bash
# From orchestrator directory
npx context-first-cli@latest feature add-repo FIN-123
```

**What happens**:
1. Shows repositories not yet in workspace
2. Lets you select additional repos
3. Creates worktrees for selected repos
4. Copies `.env*` files (optional)
5. Updates `docker-compose.yml`

**Example**:
```bash
$ npx context-first-cli@latest feature add-repo FIN-123
? Select additional repositories: backend, shared-utils
? Copy .env* files? Yes
✓ Created worktree for backend
✓ Created worktree for shared-utils
✓ Updated workspace metadata
✓ Updated docker-compose.yml
```

#### Work on Feature

```bash
# Open in editor
code .

# Use AI commands (if configured)
/start    # Create context.md and architecture.md
/plan     # Create plan.md
/work     # Implement feature
/pre-pr   # Review before PR
/pr       # Create pull request
```

#### Stop Services

```bash
docker-compose down
```

#### Finish Feature

**Option 1: Merge via CLI**
```bash
# From orchestrator directory
npx context-first-cli@latest feature merge FIN-123
```

**Option 2: Merge via GitHub + Clean Up**
```bash
# 1. Create PR via /pr command or manually
# 2. Merge PR on GitHub
# 3. Clean up workspace
npx context-first-cli@latest feature end FIN-123
```

---

## Docker Support

### Automatic Generation

When you run `feature start`, the CLI generates `docker-compose.yml` with:

- **Backend** (if `role: "backend"` exists)
- **Frontend** (if `role: "frontend"` exists)
- **PostgreSQL** (always included)
- **Redis** (always included)

### Dynamic Ports

Ports are calculated from issue number:

```
FIN-11:  Backend 3011, Frontend 8011, Postgres 5411, Redis 6311
FIN-123: Backend 3123, Frontend 8123, Postgres 5523, Redis 6423
```

**Benefit**: Run multiple workspaces simultaneously without conflicts!

### Configuration

Edit `ai.properties.md` to customize base ports:

```markdown
## Docker Configuration

docker.backend_base_port=3000
docker.frontend_base_port=8000
docker.postgres_base_port=5400
docker.redis_base_port=6300
```

### Example `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3011:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/app
    networks:
      - fin-11-network

  frontend:
    build: ./frontend
    ports:
      - "8011:8080"
    environment:
      - VITE_API_URL=http://localhost:3011
    networks:
      - fin-11-network

  postgres:
    image: postgres:15-alpine
    ports:
      - "5411:5432"
    networks:
      - fin-11-network

  redis:
    image: redis:7-alpine
    ports:
      - "6311:6379"
    networks:
      - fin-11-network

networks:
  fin-11-network:
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Developer Machine                       │
│                                                               │
│  ┌───────────────┐                                           │
│  │ context-cli   │  (Universal CLI)                          │
│  └───────┬───────┘                                           │
│          │                                                    │
│          ├─────────────────────────────────────────┐         │
│          │                                         │         │
│  ┌───────▼────────────────────────┐       ┌───────▼─────┐   │
│  │   Orchestrator Repository      │       │  Workspaces │   │
│  │                                 │       │             │   │
│  │  • context-manifest.json        │       │  FIN-11/    │   │
│  │  • .claude/commands/            │       │  FIN-12/    │   │
│  │  • ai.properties.md             │       │  FIN-13/    │   │
│  └─────────────────────────────────┘       └─────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Main Repositories                         │
│                                                               │
│  ~/dev/backend/     (main branch)                            │
│  ~/dev/frontend/    (main branch)                            │
│  ~/dev/metaspecs/   (main branch)                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Flow**:
1. CLI reads orchestrator configuration
2. Creates workspace with worktrees
3. Worktrees link to main repositories
4. Developer works in isolated workspace
5. Changes pushed to main repositories

---

## Examples

### Example 1: Complete Setup

```bash
# Create orchestrator
npx context-first-cli@latest create:orchestrator
# Name: my-saas-orchestrator
# Description: SaaS project orchestrator

# Configure
cd my-saas-orchestrator/
npx context-first-cli@latest config:setup
# Base path: ~/dev
# Auto-clone: Yes
# Task manager: Jira
# Jira site: https://mycompany.atlassian.net
# Jira project: SAAS

# Add repositories
npx context-first-cli@latest add:repo
# Folder name: my-saas-backend
# URL: git@github.com:myorg/my-saas-backend.git
# Role: backend

npx context-first-cli@latest add:repo
# Folder name: my-saas-frontend
# URL: git@github.com:myorg/my-saas-frontend.git
# Role: frontend

# Commit
git add .
git commit -m "feat: setup orchestrator"
git push -u origin main
```

### Example 2: Working on Feature

```bash
# Start feature
npx context-first-cli@latest feature start SAAS-456

# Enter workspace
cd .sessions/SAAS-456

# Start services
docker-compose up -d

# Work
code .

# Stop services
docker-compose down

# Merge and clean up
cd ../..
npx context-first-cli@latest feature merge SAAS-456
```

### Example 3: Parallel Development

```bash
# Developer working on two features simultaneously

# Feature 1
npx context-first-cli@latest feature start FIN-11
cd .sessions/FIN-11
docker-compose up -d
# Backend at http://localhost:3011

# Feature 2 (in another terminal)
cd ~/my-orchestrator
npx context-first-cli@latest feature start FIN-12
cd .sessions/FIN-12
docker-compose up -d
# Backend at http://localhost:3012

# Both running simultaneously! No conflicts!
```

---

## Troubleshooting

### Issue: "Workspace already exists"

**Cause**: You already created a workspace for this issue.

**Solution**:
```bash
# Option 1: Use existing workspace
cd .sessions/FIN-123

# Option 2: Clean up and recreate
npx context-first-cli@latest feature end FIN-123
npx context-first-cli@latest feature start FIN-123
```

### Issue: "Repository not found"

**Cause**: Repository doesn't exist in `base_path`.

**Solution**:
```bash
# Option 1: Clone manually
cd ~/dev
git clone <repo-url> <repo-folder-name>

# Option 2: Enable auto_clone
# Edit ai.properties.md:
auto_clone=true
```

### Issue: "Branch already in use"

**Cause**: Main repository is on the feature branch.

**Solution**:
```bash
# Go to main repository
cd ~/dev/<repo-name>

# Switch to main branch
git checkout main

# Try again
cd ~/orchestrator
npx context-first-cli@latest feature start FIN-123
```

### Issue: "Port already in use"

**Cause**: Another workspace with same issue number is running.

**Solution**:
```bash
# Stop other workspace
cd .sessions/FIN-123
docker-compose down

# Or use different issue number
```

### Issue: "Docker containers not stopping"

**Cause**: `feature end` failed to stop containers.

**Solution**:
```bash
# Manually stop containers
cd .sessions/FIN-123
docker-compose down -v

# Then clean up workspace
cd ../..
npx context-first-cli@latest feature end FIN-123
```

---

## Advanced Usage

### Custom Docker Ports

Edit `ai.properties.md`:

```markdown
docker.backend_base_port=4000
docker.frontend_base_port=9000
docker.postgres_base_port=6000
docker.redis_base_port=7000
```

Now FIN-11 will use ports 4011, 9011, 6011, 7011.

### Merge Options

```bash
# Merge to develop instead of main
npx context-first-cli@latest feature merge FIN-123 --target-branch develop

# Merge without pushing (review first)
npx context-first-cli@latest feature merge FIN-123 --no-push

# Keep workspace after merge
npx context-first-cli@latest feature merge FIN-123 --keep-workspace

# Force merge without confirmation
npx context-first-cli@latest feature merge FIN-123 --force
```

### Update Commands

When CLI is updated, refresh AI command templates:

```bash
cd ~/orchestrator
npx context-first-cli@latest update:commands
```

---

## Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/thatix-io/context-first-cli).

---

## License

MIT © [Thiago Abreu](https://github.com/thatix-io)

---

## Links

- **NPM**: https://www.npmjs.com/package/context-first-cli
- **GitHub**: https://github.com/thatix-io/context-first-cli
- **Issues**: https://github.com/thatix-io/context-first-cli/issues
- **Documentation**: https://github.com/thatix-io/context-first-cli#readme

---

**Made with ❤️ for developers who value context and efficiency.**
