"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureCommands = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const inquirer_1 = __importDefault(require("inquirer"));
const config_1 = require("../utils/config");
const git_1 = require("../utils/git");
exports.featureCommands = {
    start: async (issueId, options) => {
        console.log(chalk_1.default.blue.bold(`\n🚀 Starting feature workspace for: ${issueId}\n`));
        // Find configuration
        const configResult = await (0, config_1.findConfig)();
        if (!configResult) {
            (0, config_1.exitWithError)('No .contextrc.json found. Run "context-cli init" first.');
        }
        const { config, configDir } = configResult;
        console.log(chalk_1.default.gray(`✓ Found configuration in ${configDir}`));
        // Determine orchestrator path
        const orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
        // Clone orchestrator if needed
        if (!(await (0, config_1.pathExists)(orchestratorPath))) {
            console.log(chalk_1.default.blue('\n📦 Cloning orchestrator repository...'));
            try {
                await (0, git_1.ensureRepoCloned)(config.orchestratorRepo, orchestratorPath);
            }
            catch (error) {
                (0, config_1.exitWithError)(`Failed to clone orchestrator: ${error.message}`);
            }
        }
        else {
            console.log(chalk_1.default.gray('✓ Orchestrator repository already cloned'));
        }
        // Load manifest
        const manifest = await (0, config_1.loadManifest)(orchestratorPath);
        if (!manifest) {
            (0, config_1.exitWithError)('Could not load context-manifest.json from orchestrator');
        }
        console.log(chalk_1.default.gray(`✓ Loaded manifest for project: ${manifest.project}`));
        // Determine which repositories to include
        let repoIds;
        if (options.repos) {
            repoIds = options.repos.split(',').map(r => r.trim());
        }
        else {
            // Interactive selection
            const { selectedRepos } = await inquirer_1.default.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedRepos',
                    message: 'Select repositories to include in this workspace:',
                    choices: manifest.repositories.map(repo => ({
                        name: `${repo.id} - ${repo.description}`,
                        value: repo.id,
                        checked: repo.role === 'application', // Auto-select application repos
                    })),
                    validate: (answer) => {
                        if (answer.length === 0) {
                            return 'You must select at least one repository';
                        }
                        return true;
                    },
                },
            ]);
            repoIds = selectedRepos;
        }
        // Create workspace directory
        const workspacesDir = (0, config_1.getWorkspacesDir)();
        await (0, config_1.ensureDir)(workspacesDir);
        const workspacePath = path_1.default.join(workspacesDir, issueId);
        if (await (0, config_1.pathExists)(workspacePath)) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} already exists at ${workspacePath}`);
        }
        await (0, config_1.ensureDir)(workspacePath);
        console.log(chalk_1.default.green(`\n✓ Created workspace directory: ${workspacePath}`));
        // Ensure main repositories are cloned
        console.log(chalk_1.default.blue('\n📦 Ensuring main repositories are cloned...'));
        const mainReposDir = path_1.default.join(configDir, '.context-repos');
        await (0, config_1.ensureDir)(mainReposDir);
        const selectedRepos = manifest.repositories.filter(repo => repoIds.includes(repo.id));
        for (const repo of selectedRepos) {
            const mainRepoPath = path_1.default.join(mainReposDir, repo.id);
            if (!(await (0, config_1.pathExists)(mainRepoPath))) {
                console.log(chalk_1.default.blue(`\n  Cloning ${repo.id}...`));
                try {
                    await (0, git_1.ensureRepoCloned)(repo.url, mainRepoPath);
                }
                catch (error) {
                    (0, config_1.exitWithError)(`Failed to clone ${repo.id}: ${error.message}`);
                }
            }
            else {
                console.log(chalk_1.default.gray(`  ✓ ${repo.id} already cloned`));
            }
        }
        // Create worktrees
        console.log(chalk_1.default.blue('\n🌳 Creating worktrees...'));
        const branchName = `feature/${issueId}`;
        for (const repo of selectedRepos) {
            const mainRepoPath = path_1.default.join(mainReposDir, repo.id);
            const worktreePath = path_1.default.join(workspacePath, repo.id);
            console.log(chalk_1.default.blue(`\n  Creating worktree for ${repo.id}...`));
            try {
                await (0, git_1.createWorktree)(mainRepoPath, worktreePath, branchName);
            }
            catch (error) {
                console.log(chalk_1.default.yellow(`  Warning: ${error.message}`));
            }
        }
        // Save workspace metadata
        const metadata = {
            issueId,
            repositories: repoIds,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            status: 'active',
        };
        await (0, config_1.saveWorkspaceMetadata)(workspacePath, metadata);
        console.log(chalk_1.default.green.bold('\n✅ Workspace created successfully!'));
        console.log(chalk_1.default.blue('\n📁 Workspace location:'));
        console.log(chalk_1.default.white(`   ${workspacePath}`));
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray(`   cd ${workspacePath}`));
        console.log(chalk_1.default.gray('   code .'));
        console.log(chalk_1.default.gray('   # Start working on your feature!'));
    },
    list: async () => {
        console.log(chalk_1.default.blue.bold('\n📋 Active Feature Workspaces\n'));
        const workspacesDir = (0, config_1.getWorkspacesDir)();
        if (!(await (0, config_1.pathExists)(workspacesDir))) {
            console.log(chalk_1.default.yellow('No workspaces found. Create one with "context-cli feature:start <issue-id>"'));
            return;
        }
        const entries = await promises_1.default.readdir(workspacesDir, { withFileTypes: true });
        const workspaceDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
        if (workspaceDirs.length === 0) {
            console.log(chalk_1.default.yellow('No workspaces found.'));
            return;
        }
        const workspaces = [];
        for (const issueId of workspaceDirs) {
            const workspacePath = path_1.default.join(workspacesDir, issueId);
            const metadata = await (0, config_1.loadWorkspaceMetadata)(workspacePath);
            workspaces.push({ issueId, metadata });
        }
        console.log(chalk_1.default.bold('Issue ID       | Repositories           | Created        | Status'));
        console.log(chalk_1.default.gray('─'.repeat(75)));
        for (const { issueId, metadata } of workspaces) {
            if (metadata) {
                const repos = metadata.repositories.join(', ');
                const created = new Date(metadata.createdAt).toLocaleDateString();
                const status = metadata.status === 'active' ? chalk_1.default.green('active') : chalk_1.default.gray('archived');
                console.log(`${chalk_1.default.cyan(issueId.padEnd(14))} | ${repos.padEnd(22)} | ${created.padEnd(14)} | ${status}`);
            }
            else {
                console.log(`${chalk_1.default.cyan(issueId.padEnd(14))} | ${chalk_1.default.gray('(no metadata)')}`);
            }
        }
        console.log(chalk_1.default.gray('\n💡 Use "context-cli feature:switch <issue-id>" to switch to a workspace'));
    },
    switch: async (issueId) => {
        const workspacesDir = (0, config_1.getWorkspacesDir)();
        const workspacePath = path_1.default.join(workspacesDir, issueId);
        if (!(await (0, config_1.pathExists)(workspacePath))) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} not found. Use "context-cli feature:list" to see available workspaces.`);
        }
        console.log(chalk_1.default.green(`\n✓ Workspace found: ${issueId}`));
        console.log(chalk_1.default.blue('\n💡 To switch to this workspace, run:'));
        console.log(chalk_1.default.white(`   cd ${workspacePath}`));
    },
    end: async (issueId, options) => {
        console.log(chalk_1.default.blue.bold(`\n🧹 Ending feature workspace: ${issueId}\n`));
        const workspacesDir = (0, config_1.getWorkspacesDir)();
        const workspacePath = path_1.default.join(workspacesDir, issueId);
        if (!(await (0, config_1.pathExists)(workspacePath))) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} not found.`);
        }
        const metadata = await (0, config_1.loadWorkspaceMetadata)(workspacePath);
        if (!metadata) {
            (0, config_1.exitWithError)('Could not load workspace metadata');
        }
        // Confirm deletion
        if (!options.force) {
            const { confirm } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `Are you sure you want to end workspace ${issueId}? This will remove all worktrees.`,
                    default: false,
                },
            ]);
            if (!confirm) {
                console.log(chalk_1.default.yellow('✋ Operation cancelled'));
                return;
            }
        }
        // Find configuration to locate main repos
        const configResult = await (0, config_1.findConfig)();
        if (!configResult) {
            (0, config_1.exitWithError)('No .contextrc.json found');
        }
        const { configDir } = configResult;
        const mainReposDir = path_1.default.join(configDir, '.context-repos');
        // Remove worktrees
        console.log(chalk_1.default.blue('🌳 Removing worktrees...'));
        for (const repoId of metadata.repositories) {
            const mainRepoPath = path_1.default.join(mainReposDir, repoId);
            const worktreePath = path_1.default.join(workspacePath, repoId);
            if (await (0, config_1.pathExists)(mainRepoPath)) {
                console.log(chalk_1.default.gray(`  Removing worktree for ${repoId}...`));
                await (0, git_1.removeWorktree)(mainRepoPath, worktreePath);
            }
        }
        // Remove workspace directory
        console.log(chalk_1.default.blue('\n🗑️  Removing workspace directory...'));
        await promises_1.default.rm(workspacePath, { recursive: true, force: true });
        console.log(chalk_1.default.green.bold('\n✅ Workspace ended successfully!'));
    },
};
//# sourceMappingURL=feature.js.map