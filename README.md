# Context-First CLI

A generic, cross-platform CLI to manage the **Context-First** development methodology across any project ecosystem. This tool provides a robust framework for orchestrating development workflows, managing multiple repositories, and ensuring consistency for both human developers and AI agents.

---

## 🚀 Core Concepts

This CLI is built on three core concepts that enable scalable, parallel, and context-aware development.

### 1. The Orchestrator Repository

Instead of embedding process logic into each of your application repositories, you define it in one central **Orchestrator Repository**. This repository acts as the single source of truth for your development methodology. It contains:

-   **Command Definitions**: Markdown files (`/commands/definitions`) that instruct an AI (like Claude) on the purpose and logic of each step in your process (e.g., `/work`, `/spec`).
-   **Repository Manifest**: A `context-manifest.json` file that maps out your entire project ecosystem, defining all repositories and their relationships.
-   **Configuration Templates**: Files like `ai.properties.md` that define project-specific commands (lint, test, build) and settings.

### 2. Feature Workspaces

To enable parallel development without conflicts, the CLI uses **Feature Workspaces**. When you start working on a new feature (e.g., an issue from Jira), the CLI creates a dedicated, isolated directory. Inside this workspace, it uses `git worktree` to check out a specific branch for each relevant repository. This is extremely efficient, as it doesn't re-clone the entire repository, saving disk space and time.

-   **Isolation**: Every feature has its own folder, preventing any overlap or context-clash between concurrent tasks.
-   **Efficiency**: Powered by `git worktree`, creating and switching between workspaces is nearly instantaneous.

### 3. The Agnostic CLI (`context-cli`)

This is the tool you install on your machine. It's completely project-agnostic. You can use the same CLI to manage desenvolvimento para o `credit-flow`, `orca-sonhos`, ou qualquer outro projeto.

-   **Cross-Platform**: Built with Node.js/TypeScript, it works seamlessly on Windows, macOS, and Linux.
-   **Configurable**: The `init` command creates a `.contextrc.json` file in your project, telling the CLI which Orchestrator to use.
-   **AI-Agnostic**: You can configure it to create command structures for different AI providers (e.g., `.claude/commands` for Claude, `.cursor/commands` for Cursor).

---

## ⚙️ Getting Started

### Installation

Install the CLI globally on your machine via NPM.

```bash
npm install -g context-first-cli
```
*(Note: Once published to NPM)*

### Initialization

There are two main scenarios for getting started.

**Scenario 1: You have an existing project and want to adopt Context-First.**

1.  Navigate to the root of one of your application repositories.
2.  Run the `init` command:
    ```bash
    context-cli init
    ```
3.  The CLI will ask you for the Git URL of your Orchestrator repository and your preferred AI provider. It will then create a `.contextrc.json` file to link this project to its orchestrator.

**Scenario 2: You are starting a new project ecosystem from scratch.**

1.  Create a new, empty directory for your orchestrator.
2.  Run the `scaffold:orchestrator` command:
    ```bash
    context-cli scaffold:orchestrator
    ```
3.  This will generate a complete, ready-to-use Orchestrator repository with template files and a standard directory structure.

---

## 📋 Main Commands

Below is an overview of the primary commands available in the CLI.

| Command | Description |
| :--- | :--- |
| `context-cli init` | **Initializes** a project by creating a `.contextrc.json` file that links it to an orchestrator. |
| `context-cli scaffold:orchestrator` | **Creates a new** Orchestrator repository from a best-practice template. |
| `context-cli feature:start <issue-id>` | **Starts a new feature** by creating an isolated workspace with all necessary repositories checked out via `git worktree`. |
| `context-cli feature:list` | **Lists all** active feature workspaces on your machine. |
| `context-cli feature:end <issue-id>` | **Cleans up** a completed feature by removing the worktrees and archiving the workspace. |
| `context-cli work "<message>"` | **Records a unit of work** within the current workspace, typically performing a `git commit`. |
| `context-cli spec` | **Generates specifications** (e.g., a PRD) for the feature in the current workspace. |
| `context-cli doctor` | **Checks your environment** to ensure all configurations, paths, and dependencies are correctly set up. |

### Example Workflow

```bash
# 1. Start work on a new feature from Jira
context-cli feature:start FIN-123

# 2. Navigate into the newly created workspace
cd workspaces/FIN-123

# 3. Open the workspace in your favorite editor
code .

# 4. Make code changes, then record your work
context-cli work "feat(api): add validation to user endpoint"

# 5. When done, create pull requests
context-cli pr
```

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    subgraph User (Any OS)
        Dev[Developer] -->|uses| CLI
    end

    subgraph CLI (context-cli NPM package)
        CLI[CLI Commands] -->|reads| Config
        CLI -->|executes logic on| Workspace
    end

    subgraph Project Setup
        Config[.contextrc.json] -->|points to| OrchestratorRepo
    end

    subgraph OrchestratorRepo [Orchestrator Repository]
        style OrchestratorRepo fill:#cde,stroke:#333,stroke-width:2px
        Manifest[context-manifest.json]
        Defs[commands/definitions/*.md]
    end

    subgraph Workspace [Feature Workspace]
        style Workspace fill:#f9f,stroke:#333,stroke-width:2px
        Worktree1[Worktree of Repo A]
        Worktree2[Worktree of Repo B]
    end

    CLI -- "Reads Manifest from" --> Manifest
    CLI -- "Creates/Manages" --> Workspace
```

This structure ensures a clean separation of concerns:

-   **The CLI** is the universal engine.
-   **The Orchestrator Repo** defines the process for a specific project.
-   **The Workspace** is the temporary, isolated environment where work actually happens.
