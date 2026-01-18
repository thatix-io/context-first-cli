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
const ai_properties_1 = require("../utils/ai-properties");
const docker_1 = require("../utils/docker");
/**
 * Get orchestrator path from config
 */
async function getOrchestratorPath() {
    const configResult = await (0, config_1.findConfig)();
    if (!configResult) {
        return null;
    }
    const { configDir } = configResult;
    // Check if we're already in the orchestrator
    const aiPropertiesInConfigDir = path_1.default.join(configDir, 'ai.properties.md');
    if (await (0, config_1.pathExists)(aiPropertiesInConfigDir)) {
        // We're already in the orchestrator
        return configDir;
    }
    // We're in a different repo, use .context-orchestrator
    return path_1.default.join(configDir, '.context-orchestrator');
}
/**
 * Get sessions directory from orchestrator
 */
async function getSessionsDir() {
    const orchestratorPath = await getOrchestratorPath();
    if (!orchestratorPath) {
        return null;
    }
    return path_1.default.join(orchestratorPath, '.sessions');
}
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
        // If we're already in the orchestrator (has ai.properties.md), use configDir
        // Otherwise, use .context-orchestrator subdirectory
        let orchestratorPath;
        const aiPropertiesInConfigDir = path_1.default.join(configDir, 'ai.properties.md');
        if (await (0, config_1.pathExists)(aiPropertiesInConfigDir)) {
            // We're already in the orchestrator
            orchestratorPath = configDir;
            console.log(chalk_1.default.gray('✓ Running from orchestrator directory'));
        }
        else {
            // We're in a different repo, need to clone orchestrator
            orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
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
        }
        // Load ai.properties.md
        console.log(chalk_1.default.blue('\n⚙️  Loading configuration from ai.properties.md...'));
        const aiProperties = await (0, ai_properties_1.loadAiProperties)(orchestratorPath);
        if (!aiProperties) {
            (0, config_1.exitWithError)('Could not load ai.properties.md from orchestrator.\n' +
                'Run "context-cli config:setup" to create it.');
        }
        const basePath = (0, ai_properties_1.getBasePath)(aiProperties);
        if (!basePath) {
            (0, config_1.exitWithError)('base_path not configured in ai.properties.md.\n' +
                'Run "context-cli config:setup" to configure it.');
        }
        const autoClone = (0, ai_properties_1.isAutoCloneEnabled)(aiProperties);
        console.log(chalk_1.default.gray(`✓ base_path: ${basePath}`));
        console.log(chalk_1.default.gray(`✓ auto_clone: ${autoClone}`));
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
        // Create workspace directory in orchestrator/.sessions/
        const sessionsDir = path_1.default.join(orchestratorPath, '.sessions');
        await (0, config_1.ensureDir)(sessionsDir);
        const workspacePath = path_1.default.join(sessionsDir, issueId);
        if (await (0, config_1.pathExists)(workspacePath)) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} already exists at ${workspacePath}`);
        }
        await (0, config_1.ensureDir)(workspacePath);
        console.log(chalk_1.default.green(`\n✓ Created workspace directory: ${workspacePath}`));
        // Process each repository
        console.log(chalk_1.default.blue('\n🌳 Setting up repositories...'));
        const selectedRepos = manifest.repositories.filter(repo => repoIds.includes(repo.id));
        const branchName = `feature/${issueId}`;
        for (const repo of selectedRepos) {
            console.log(chalk_1.default.blue(`\n  Processing ${repo.id}...`));
            // Check if repo exists at base_path
            const mainRepoPath = path_1.default.join(basePath, repo.id);
            const repoExists = await (0, config_1.pathExists)(mainRepoPath);
            if (!repoExists) {
                if (autoClone) {
                    // Clone the repository
                    console.log(chalk_1.default.blue(`    Cloning ${repo.id} to ${mainRepoPath}...`));
                    try {
                        await (0, git_1.ensureRepoCloned)(repo.url, mainRepoPath);
                        console.log(chalk_1.default.green(`    ✓ Cloned ${repo.id}`));
                    }
                    catch (error) {
                        console.log(chalk_1.default.yellow(`    ⚠ Failed to clone ${repo.id}: ${error.message}`));
                        console.log(chalk_1.default.yellow(`    Skipping ${repo.id}...`));
                        continue;
                    }
                }
                else {
                    // Skip if auto_clone is disabled
                    console.log(chalk_1.default.yellow(`    ⚠ Repository not found at ${mainRepoPath}`));
                    console.log(chalk_1.default.yellow(`    Set auto_clone=true in ai.properties.md to enable automatic cloning`));
                    console.log(chalk_1.default.yellow(`    Skipping ${repo.id}...`));
                    continue;
                }
            }
            else {
                console.log(chalk_1.default.gray(`    ✓ Repository exists at ${mainRepoPath}`));
            }
            // Create worktree
            const worktreePath = path_1.default.join(workspacePath, repo.id);
            console.log(chalk_1.default.blue(`    Creating worktree at ${worktreePath}...`));
            try {
                await (0, git_1.createWorktree)(mainRepoPath, worktreePath, branchName);
                console.log(chalk_1.default.green(`    ✓ Created worktree for ${repo.id}`));
            }
            catch (error) {
                console.log(chalk_1.default.yellow(`    ⚠ Failed to create worktree: ${error.message}`));
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
        // Generate docker-compose.yml
        console.log(chalk_1.default.blue('\nGenerating docker-compose.yml...'));
        await (0, docker_1.generateDockerCompose)(workspacePath, issueId, selectedRepos);
        console.log(chalk_1.default.green.bold('\n✅ Workspace created successfully!'));
        console.log(chalk_1.default.blue('\n📁 Workspace location:'));
        console.log(chalk_1.default.white(`   ${workspacePath}`));
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray(`   cd ${workspacePath}`));
        console.log(chalk_1.default.gray('   docker-compose up -d  # Start services'));
        console.log(chalk_1.default.gray('   code .'));
        console.log(chalk_1.default.gray('   # Start working on your feature!'));
    },
    list: async () => {
        console.log(chalk_1.default.blue.bold('\n📋 Active Feature Workspaces\n'));
        const sessionsDir = await getSessionsDir();
        if (!sessionsDir) {
            console.log(chalk_1.default.yellow('No configuration found. Run "context-cli init" first.'));
            return;
        }
        if (!(await (0, config_1.pathExists)(sessionsDir))) {
            console.log(chalk_1.default.yellow('No workspaces found. Create one with "context-cli feature start <issue-id>"'));
            return;
        }
        const entries = await promises_1.default.readdir(sessionsDir, { withFileTypes: true });
        const workspaceDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
        if (workspaceDirs.length === 0) {
            console.log(chalk_1.default.yellow('No workspaces found.'));
            return;
        }
        const workspaces = [];
        for (const issueId of workspaceDirs) {
            const workspacePath = path_1.default.join(sessionsDir, issueId);
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
        console.log(chalk_1.default.gray('\n💡 Use "context-cli feature switch <issue-id>" to switch to a workspace'));
    },
    switch: async (issueId) => {
        const sessionsDir = await getSessionsDir();
        if (!sessionsDir) {
            (0, config_1.exitWithError)('No configuration found. Run "context-cli init" first.');
        }
        const workspacePath = path_1.default.join(sessionsDir, issueId);
        if (!(await (0, config_1.pathExists)(workspacePath))) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} not found`);
        }
        console.log(chalk_1.default.green(`\n✓ Workspace found: ${workspacePath}`));
        console.log(chalk_1.default.blue('\n💡 To switch to this workspace:'));
        console.log(chalk_1.default.gray(`   cd ${workspacePath}`));
        console.log(chalk_1.default.gray('   code .'));
    },
    remove: async (issueId, options) => {
        console.log(chalk_1.default.blue.bold(`\n🗑️  Removing workspace: ${issueId}\n`));
        const sessionsDir = await getSessionsDir();
        if (!sessionsDir) {
            (0, config_1.exitWithError)('No configuration found. Run "context-cli init" first.');
        }
        const workspacePath = path_1.default.join(sessionsDir, issueId);
        if (!(await (0, config_1.pathExists)(workspacePath))) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} not found`);
        }
        // Load metadata to get repository list
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
                    message: `Are you sure you want to remove workspace ${issueId}?`,
                    default: false,
                },
            ]);
            if (!confirm) {
                console.log(chalk_1.default.yellow('✋ Removal cancelled'));
                return;
            }
        }
        // Cleanup Docker containers
        await (0, docker_1.cleanupDockerContainers)(workspacePath, issueId);
        // Remove worktrees
        console.log(chalk_1.default.blue('Removing worktrees...'));
        // Load ai.properties to get base_path
        const configResult = await (0, config_1.findConfig)();
        if (configResult) {
            const { configDir } = configResult;
            // Determine orchestrator path (same logic as feature start)
            let orchestratorPath;
            const aiPropertiesInConfigDir = path_1.default.join(configDir, 'ai.properties.md');
            if (await (0, config_1.pathExists)(aiPropertiesInConfigDir)) {
                // We're already in the orchestrator
                orchestratorPath = configDir;
            }
            else {
                // We're in a different repo
                orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
            }
            const aiProperties = await (0, ai_properties_1.loadAiProperties)(orchestratorPath);
            const basePath = (0, ai_properties_1.getBasePath)(aiProperties);
            if (basePath) {
                for (const repoId of metadata.repositories) {
                    const worktreePath = path_1.default.join(workspacePath, repoId);
                    const mainRepoPath = path_1.default.join(basePath, repoId);
                    if (await (0, config_1.pathExists)(worktreePath)) {
                        try {
                            console.log(chalk_1.default.gray(`  Removing worktree for ${repoId}...`));
                            await (0, git_1.removeWorktree)(mainRepoPath, worktreePath);
                        }
                        catch (error) {
                            console.log(chalk_1.default.yellow(`  Warning: ${error.message}`));
                        }
                    }
                }
            }
        }
        // Remove workspace directory
        console.log(chalk_1.default.blue('Removing workspace directory...'));
        await promises_1.default.rm(workspacePath, { recursive: true, force: true });
        console.log(chalk_1.default.green(`\n✅ Workspace ${issueId} removed successfully`));
    },
    status: async (issueId) => {
        const sessionsDir = await getSessionsDir();
        if (!sessionsDir) {
            (0, config_1.exitWithError)('No configuration found. Run "context-cli init" first.');
        }
        if (issueId) {
            // Show status for specific workspace
            const workspacePath = path_1.default.join(sessionsDir, issueId);
            if (!(await (0, config_1.pathExists)(workspacePath))) {
                (0, config_1.exitWithError)(`Workspace for ${issueId} not found`);
            }
            const metadata = await (0, config_1.loadWorkspaceMetadata)(workspacePath);
            if (!metadata) {
                (0, config_1.exitWithError)('Could not load workspace metadata');
            }
            console.log(chalk_1.default.blue.bold(`\n📊 Workspace Status: ${issueId}\n`));
            console.log(chalk_1.default.gray(`Created: ${new Date(metadata.createdAt).toLocaleString()}`));
            console.log(chalk_1.default.gray(`Last Updated: ${new Date(metadata.lastUpdated).toLocaleString()}`));
            console.log(chalk_1.default.gray(`Status: ${metadata.status}`));
            console.log(chalk_1.default.gray(`\nRepositories:`));
            for (const repoId of metadata.repositories) {
                const worktreePath = path_1.default.join(workspacePath, repoId);
                const exists = await (0, config_1.pathExists)(worktreePath);
                const status = exists ? chalk_1.default.green('✓') : chalk_1.default.red('✗');
                console.log(`  ${status} ${repoId}`);
            }
        }
        else {
            // Show current workspace status (if in workspace)
            const cwd = process.cwd();
            // Check if we're in a .sessions workspace
            if (cwd.includes('.sessions')) {
                const parts = cwd.split(path_1.default.sep);
                const sessionIndex = parts.indexOf('.sessions');
                if (sessionIndex >= 0 && parts.length > sessionIndex + 1) {
                    const currentIssueId = parts[sessionIndex + 1];
                    await exports.featureCommands.status(currentIssueId);
                    return;
                }
            }
            console.log(chalk_1.default.yellow('Not in a feature workspace. Use "context-cli feature list" to see all workspaces.'));
        }
    },
    merge: async (issueId, options) => {
        console.log(chalk_1.default.blue.bold(`\n🔀 Merging feature: ${issueId}\n`));
        const sessionsDir = await getSessionsDir();
        if (!sessionsDir) {
            (0, config_1.exitWithError)('No configuration found. Run "context-cli init" first.');
        }
        const workspacePath = path_1.default.join(sessionsDir, issueId);
        if (!(await (0, config_1.pathExists)(workspacePath))) {
            (0, config_1.exitWithError)(`Workspace for ${issueId} not found`);
        }
        // Load metadata to get repository list
        const metadata = await (0, config_1.loadWorkspaceMetadata)(workspacePath);
        if (!metadata) {
            (0, config_1.exitWithError)('Could not load workspace metadata');
        }
        const targetBranch = options.targetBranch || 'main';
        const branchName = `feature/${issueId}`;
        // Confirm merge
        if (!options.force) {
            const { confirm } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `Merge ${branchName} into ${targetBranch} in ${metadata.repositories.length} repository(ies)?`,
                    default: false,
                },
            ]);
            if (!confirm) {
                console.log(chalk_1.default.yellow('✋ Merge cancelled'));
                return;
            }
        }
        // Load ai.properties to get base_path
        const configResult = await (0, config_1.findConfig)();
        if (!configResult) {
            (0, config_1.exitWithError)('No configuration found');
        }
        const { configDir } = configResult;
        // Determine orchestrator path
        let orchestratorPath;
        const aiPropertiesInConfigDir = path_1.default.join(configDir, 'ai.properties.md');
        if (await (0, config_1.pathExists)(aiPropertiesInConfigDir)) {
            orchestratorPath = configDir;
        }
        else {
            orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
        }
        const aiProperties = await (0, ai_properties_1.loadAiProperties)(orchestratorPath);
        const basePath = (0, ai_properties_1.getBasePath)(aiProperties);
        if (!basePath) {
            (0, config_1.exitWithError)('Could not determine base_path from ai.properties.md');
        }
        // Merge each repository
        console.log(chalk_1.default.blue(`\nMerging ${branchName} into ${targetBranch}...\n`));
        const mergeErrors = [];
        for (const repoId of metadata.repositories) {
            const mainRepoPath = path_1.default.join(basePath, repoId);
            if (!(await (0, config_1.pathExists)(mainRepoPath))) {
                console.log(chalk_1.default.yellow(`  ⚠ Repository ${repoId} not found at ${mainRepoPath}, skipping`));
                continue;
            }
            try {
                console.log(chalk_1.default.gray(`  Processing ${repoId}...`));
                // Merge branch
                await (0, git_1.mergeBranch)(mainRepoPath, branchName, targetBranch);
                // Push if not disabled
                if (!options.noPush) {
                    await (0, git_1.pushBranch)(mainRepoPath, targetBranch);
                }
                // Delete feature branch
                await (0, git_1.deleteBranch)(mainRepoPath, branchName, true);
            }
            catch (error) {
                console.log(chalk_1.default.red(`  ✗ Error in ${repoId}: ${error.message}`));
                mergeErrors.push(`${repoId}: ${error.message}`);
            }
        }
        if (mergeErrors.length > 0) {
            console.log(chalk_1.default.red.bold('\n⚠️ Merge completed with errors:\n'));
            mergeErrors.forEach(err => console.log(chalk_1.default.red(`  - ${err}`)));
            console.log(chalk_1.default.yellow('\n💡 Tip: Fix errors manually and re-run merge, or use --keep-workspace to preserve the workspace'));
            return;
        }
        console.log(chalk_1.default.green.bold('\n✅ Merge completed successfully!'));
        // Remove workspace if not disabled
        if (!options.keepWorkspace) {
            console.log(chalk_1.default.blue('\nCleaning up workspace...'));
            await exports.featureCommands.remove(issueId, { force: true });
        }
        else {
            console.log(chalk_1.default.blue('\n💾 Workspace preserved (use --keep-workspace=false to remove)'));
        }
        console.log(chalk_1.default.green.bold('\n🎉 Feature merged successfully!'));
        if (!options.noPush) {
            console.log(chalk_1.default.gray(`\n💡 Changes have been pushed to ${targetBranch}`));
        }
        else {
            console.log(chalk_1.default.yellow(`\n⚠️ Remember to push ${targetBranch} manually (--no-push was used)`));
        }
    },
    end: async (issueId, options) => {
        // Alias for remove command
        await exports.featureCommands.remove(issueId, options);
    },
};
//# sourceMappingURL=feature.js.map