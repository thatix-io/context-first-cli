import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import {
  findConfig,
  loadManifest,
  getWorkspacesDir,
  ensureDir,
  pathExists,
  exitWithError,
  saveWorkspaceMetadata,
  loadWorkspaceMetadata,
  WorkspaceMetadata,
} from '../utils/config';
import {
  ensureRepoCloned,
  createWorktree,
  removeWorktree,
  listWorktrees,
} from '../utils/git';

export const featureCommands = {
  start: async (issueId: string, options: { repos?: string }) => {
    console.log(chalk.blue.bold(`\n🚀 Starting feature workspace for: ${issueId}\n`));

    // Find configuration
    const configResult = await findConfig();
    if (!configResult) {
      exitWithError('No .contextrc.json found. Run "context-cli init" first.');
    }

    const { config, configDir } = configResult;
    console.log(chalk.gray(`✓ Found configuration in ${configDir}`));

    // Determine orchestrator path
    const orchestratorPath = path.join(configDir, '.context-orchestrator');
    
    // Clone orchestrator if needed
    if (!(await pathExists(orchestratorPath))) {
      console.log(chalk.blue('\n📦 Cloning orchestrator repository...'));
      try {
        await ensureRepoCloned(config.orchestratorRepo, orchestratorPath);
      } catch (error: any) {
        exitWithError(`Failed to clone orchestrator: ${error.message}`);
      }
    } else {
      console.log(chalk.gray('✓ Orchestrator repository already cloned'));
    }

    // Load manifest
    const manifest = await loadManifest(orchestratorPath);
    if (!manifest) {
      exitWithError('Could not load context-manifest.json from orchestrator');
    }

    console.log(chalk.gray(`✓ Loaded manifest for project: ${manifest.project}`));

    // Determine which repositories to include
    let repoIds: string[];
    if (options.repos) {
      repoIds = options.repos.split(',').map(r => r.trim());
    } else {
      // Interactive selection
      const { selectedRepos } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedRepos',
          message: 'Select repositories to include in this workspace:',
          choices: manifest.repositories.map(repo => ({
            name: `${repo.id} - ${repo.description}`,
            value: repo.id,
            checked: repo.role === 'application', // Auto-select application repos
          })),
          validate: (answer: string[]) => {
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
    const workspacesDir = getWorkspacesDir();
    await ensureDir(workspacesDir);
    
    const workspacePath = path.join(workspacesDir, issueId);
    if (await pathExists(workspacePath)) {
      exitWithError(`Workspace for ${issueId} already exists at ${workspacePath}`);
    }

    await ensureDir(workspacePath);
    console.log(chalk.green(`\n✓ Created workspace directory: ${workspacePath}`));

    // Ensure main repositories are cloned
    console.log(chalk.blue('\n📦 Ensuring main repositories are cloned...'));
    const mainReposDir = path.join(configDir, '.context-repos');
    await ensureDir(mainReposDir);

    const selectedRepos = manifest.repositories.filter(repo => repoIds.includes(repo.id));
    
    for (const repo of selectedRepos) {
      const mainRepoPath = path.join(mainReposDir, repo.id);
      if (!(await pathExists(mainRepoPath))) {
        console.log(chalk.blue(`\n  Cloning ${repo.id}...`));
        try {
          await ensureRepoCloned(repo.url, mainRepoPath);
        } catch (error: any) {
          exitWithError(`Failed to clone ${repo.id}: ${error.message}`);
        }
      } else {
        console.log(chalk.gray(`  ✓ ${repo.id} already cloned`));
      }
    }

    // Create worktrees
    console.log(chalk.blue('\n🌳 Creating worktrees...'));
    const branchName = `feature/${issueId}`;

    for (const repo of selectedRepos) {
      const mainRepoPath = path.join(mainReposDir, repo.id);
      const worktreePath = path.join(workspacePath, repo.id);
      
      console.log(chalk.blue(`\n  Creating worktree for ${repo.id}...`));
      try {
        await createWorktree(mainRepoPath, worktreePath, branchName);
      } catch (error: any) {
        console.log(chalk.yellow(`  Warning: ${error.message}`));
      }
    }

    // Save workspace metadata
    const metadata: WorkspaceMetadata = {
      issueId,
      repositories: repoIds,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
    };
    await saveWorkspaceMetadata(workspacePath, metadata);

    console.log(chalk.green.bold('\n✅ Workspace created successfully!'));
    console.log(chalk.blue('\n📁 Workspace location:'));
    console.log(chalk.white(`   ${workspacePath}`));
    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray(`   cd ${workspacePath}`));
    console.log(chalk.gray('   code .'));
    console.log(chalk.gray('   # Start working on your feature!'));
  },

  list: async () => {
    console.log(chalk.blue.bold('\n📋 Active Feature Workspaces\n'));

    const workspacesDir = getWorkspacesDir();
    
    if (!(await pathExists(workspacesDir))) {
      console.log(chalk.yellow('No workspaces found. Create one with "context-cli feature:start <issue-id>"'));
      return;
    }

    const entries = await fs.readdir(workspacesDir, { withFileTypes: true });
    const workspaceDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    if (workspaceDirs.length === 0) {
      console.log(chalk.yellow('No workspaces found.'));
      return;
    }

    const workspaces: Array<{ issueId: string; metadata: WorkspaceMetadata | null }> = [];
    
    for (const issueId of workspaceDirs) {
      const workspacePath = path.join(workspacesDir, issueId);
      const metadata = await loadWorkspaceMetadata(workspacePath);
      workspaces.push({ issueId, metadata });
    }

    console.log(chalk.bold('Issue ID       | Repositories           | Created        | Status'));
    console.log(chalk.gray('─'.repeat(75)));

    for (const { issueId, metadata } of workspaces) {
      if (metadata) {
        const repos = metadata.repositories.join(', ');
        const created = new Date(metadata.createdAt).toLocaleDateString();
        const status = metadata.status === 'active' ? chalk.green('active') : chalk.gray('archived');
        console.log(`${chalk.cyan(issueId.padEnd(14))} | ${repos.padEnd(22)} | ${created.padEnd(14)} | ${status}`);
      } else {
        console.log(`${chalk.cyan(issueId.padEnd(14))} | ${chalk.gray('(no metadata)')}`);
      }
    }

    console.log(chalk.gray('\n💡 Use "context-cli feature:switch <issue-id>" to switch to a workspace'));
  },

  switch: async (issueId: string) => {
    const workspacesDir = getWorkspacesDir();
    const workspacePath = path.join(workspacesDir, issueId);

    if (!(await pathExists(workspacePath))) {
      exitWithError(`Workspace for ${issueId} not found. Use "context-cli feature:list" to see available workspaces.`);
    }

    console.log(chalk.green(`\n✓ Workspace found: ${issueId}`));
    console.log(chalk.blue('\n💡 To switch to this workspace, run:'));
    console.log(chalk.white(`   cd ${workspacePath}`));
  },

  end: async (issueId: string, options: { force?: boolean }) => {
    console.log(chalk.blue.bold(`\n🧹 Ending feature workspace: ${issueId}\n`));

    const workspacesDir = getWorkspacesDir();
    const workspacePath = path.join(workspacesDir, issueId);

    if (!(await pathExists(workspacePath))) {
      exitWithError(`Workspace for ${issueId} not found.`);
    }

    const metadata = await loadWorkspaceMetadata(workspacePath);
    if (!metadata) {
      exitWithError('Could not load workspace metadata');
    }

    // Confirm deletion
    if (!options.force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to end workspace ${issueId}? This will remove all worktrees.`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow('✋ Operation cancelled'));
        return;
      }
    }

    // Find configuration to locate main repos
    const configResult = await findConfig();
    if (!configResult) {
      exitWithError('No .contextrc.json found');
    }

    const { configDir } = configResult;
    const mainReposDir = path.join(configDir, '.context-repos');

    // Remove worktrees
    console.log(chalk.blue('🌳 Removing worktrees...'));
    for (const repoId of metadata.repositories) {
      const mainRepoPath = path.join(mainReposDir, repoId);
      const worktreePath = path.join(workspacePath, repoId);
      
      if (await pathExists(mainRepoPath)) {
        console.log(chalk.gray(`  Removing worktree for ${repoId}...`));
        await removeWorktree(mainRepoPath, worktreePath);
      }
    }

    // Remove workspace directory
    console.log(chalk.blue('\n🗑️  Removing workspace directory...'));
    await fs.rm(workspacePath, { recursive: true, force: true });

    console.log(chalk.green.bold('\n✅ Workspace ended successfully!'));
  },
};
