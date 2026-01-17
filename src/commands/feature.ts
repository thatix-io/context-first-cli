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
import {
  loadAiProperties,
  getBasePath,
  isAutoCloneEnabled,
} from '../utils/ai-properties';

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

    // Load ai.properties.md
    console.log(chalk.blue('\n⚙️  Loading configuration from ai.properties.md...'));
    const aiProperties = await loadAiProperties(orchestratorPath);
    if (!aiProperties) {
      exitWithError(
        'Could not load ai.properties.md from orchestrator.\n' +
        'Run "context-cli config:setup" to create it.'
      );
    }

    const basePath = getBasePath(aiProperties);
    if (!basePath) {
      exitWithError(
        'base_path not configured in ai.properties.md.\n' +
        'Run "context-cli config:setup" to configure it.'
      );
    }

    const autoClone = isAutoCloneEnabled(aiProperties);
    console.log(chalk.gray(`✓ base_path: ${basePath}`));
    console.log(chalk.gray(`✓ auto_clone: ${autoClone}`));

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

    // Process each repository
    console.log(chalk.blue('\n🌳 Setting up repositories...'));
    const selectedRepos = manifest.repositories.filter(repo => repoIds.includes(repo.id));
    const branchName = `feature/${issueId}`;

    for (const repo of selectedRepos) {
      console.log(chalk.blue(`\n  Processing ${repo.id}...`));
      
      // Check if repo exists at base_path
      const mainRepoPath = path.join(basePath, repo.id);
      const repoExists = await pathExists(mainRepoPath);

      if (!repoExists) {
        if (autoClone) {
          // Clone the repository
          console.log(chalk.blue(`    Cloning ${repo.id} to ${mainRepoPath}...`));
          try {
            await ensureRepoCloned(repo.url, mainRepoPath);
            console.log(chalk.green(`    ✓ Cloned ${repo.id}`));
          } catch (error: any) {
            console.log(chalk.yellow(`    ⚠ Failed to clone ${repo.id}: ${error.message}`));
            console.log(chalk.yellow(`    Skipping ${repo.id}...`));
            continue;
          }
        } else {
          // Skip if auto_clone is disabled
          console.log(chalk.yellow(`    ⚠ Repository not found at ${mainRepoPath}`));
          console.log(chalk.yellow(`    Set auto_clone=true in ai.properties.md to enable automatic cloning`));
          console.log(chalk.yellow(`    Skipping ${repo.id}...`));
          continue;
        }
      } else {
        console.log(chalk.gray(`    ✓ Repository exists at ${mainRepoPath}`));
      }

      // Create worktree
      const worktreePath = path.join(workspacePath, repo.id);
      console.log(chalk.blue(`    Creating worktree at ${worktreePath}...`));
      
      try {
        await createWorktree(mainRepoPath, worktreePath, branchName);
        console.log(chalk.green(`    ✓ Created worktree for ${repo.id}`));
      } catch (error: any) {
        console.log(chalk.yellow(`    ⚠ Failed to create worktree: ${error.message}`));
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
      console.log(chalk.yellow('No workspaces found. Create one with "context-cli feature start <issue-id>"'));
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

    console.log(chalk.gray('\n💡 Use "context-cli feature switch <issue-id>" to switch to a workspace'));
  },

  switch: async (issueId: string) => {
    const workspacesDir = getWorkspacesDir();
    const workspacePath = path.join(workspacesDir, issueId);

    if (!(await pathExists(workspacePath))) {
      exitWithError(`Workspace for ${issueId} not found`);
    }

    console.log(chalk.green(`\n✓ Workspace found: ${workspacePath}`));
    console.log(chalk.blue('\n💡 To switch to this workspace:'));
    console.log(chalk.gray(`   cd ${workspacePath}`));
    console.log(chalk.gray('   code .'));
  },

  remove: async (issueId: string, options: { force?: boolean }) => {
    console.log(chalk.blue.bold(`\n🗑️  Removing workspace: ${issueId}\n`));

    const workspacesDir = getWorkspacesDir();
    const workspacePath = path.join(workspacesDir, issueId);

    if (!(await pathExists(workspacePath))) {
      exitWithError(`Workspace for ${issueId} not found`);
    }

    // Load metadata to get repository list
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
          message: `Are you sure you want to remove workspace ${issueId}?`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow('✋ Removal cancelled'));
        return;
      }
    }

    // Remove worktrees
    console.log(chalk.blue('Removing worktrees...'));
    
    // Load ai.properties to get base_path
    const configResult = await findConfig();
    if (configResult) {
      const { configDir } = configResult;
      const orchestratorPath = path.join(configDir, '.context-orchestrator');
      const aiProperties = await loadAiProperties(orchestratorPath);
      const basePath = getBasePath(aiProperties);
      
      if (basePath) {
        for (const repoId of metadata.repositories) {
          const worktreePath = path.join(workspacePath, repoId);
          const mainRepoPath = path.join(basePath, repoId);
          
          if (await pathExists(worktreePath)) {
            try {
              console.log(chalk.gray(`  Removing worktree for ${repoId}...`));
              await removeWorktree(mainRepoPath, worktreePath);
            } catch (error: any) {
              console.log(chalk.yellow(`  Warning: ${error.message}`));
            }
          }
        }
      }
    }

    // Remove workspace directory
    console.log(chalk.blue('Removing workspace directory...'));
    await fs.rm(workspacePath, { recursive: true, force: true });

    console.log(chalk.green(`\n✅ Workspace ${issueId} removed successfully`));
  },

  status: async (issueId?: string) => {
    const workspacesDir = getWorkspacesDir();
    
    if (issueId) {
      // Show status for specific workspace
      const workspacePath = path.join(workspacesDir, issueId);
      if (!(await pathExists(workspacePath))) {
        exitWithError(`Workspace for ${issueId} not found`);
      }

      const metadata = await loadWorkspaceMetadata(workspacePath);
      if (!metadata) {
        exitWithError('Could not load workspace metadata');
      }

      console.log(chalk.blue.bold(`\n📊 Workspace Status: ${issueId}\n`));
      console.log(chalk.gray(`Created: ${new Date(metadata.createdAt).toLocaleString()}`));
      console.log(chalk.gray(`Last Updated: ${new Date(metadata.lastUpdated).toLocaleString()}`));
      console.log(chalk.gray(`Status: ${metadata.status}`));
      console.log(chalk.gray(`\nRepositories:`));
      
      for (const repoId of metadata.repositories) {
        const worktreePath = path.join(workspacePath, repoId);
        const exists = await pathExists(worktreePath);
        const status = exists ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} ${repoId}`);
      }
    } else {
      // Show current workspace status (if in workspace)
      const cwd = process.cwd();
      
      // Check if we're in a workspace
      if (cwd.includes('.context-workspaces')) {
        const parts = cwd.split(path.sep);
        const workspaceIndex = parts.indexOf('.context-workspaces');
        if (workspaceIndex >= 0 && parts.length > workspaceIndex + 1) {
          const currentIssueId = parts[workspaceIndex + 1];
          await featureCommands.status(currentIssueId);
          return;
        }
      }

      console.log(chalk.yellow('Not in a feature workspace. Use "context-cli feature list" to see all workspaces.'));
    }
  },

  end: async (issueId: string, options: { force?: boolean }) => {
    // Alias for remove command
    await featureCommands.remove(issueId, options);
  },
};
