import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import {
  findConfig,
  loadManifest,
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
  mergeBranch,
  pushBranch,
  deleteBranch,
  getCurrentBranch,
} from '../utils/git';
import {
  loadAiProperties,
  getBasePath,
  isAutoCloneEnabled,
} from '../utils/ai-properties';
import {
  generateDockerCompose,
  cleanupDockerContainers,
} from '../utils/docker';

/**
 * Get orchestrator path from config
 */
async function getOrchestratorPath(): Promise<string | null> {
  const configResult = await findConfig();
  if (!configResult) {
    return null;
  }
  
  const { configDir } = configResult;
  
  // Check if we're already in the orchestrator
  const aiPropertiesInConfigDir = path.join(configDir, 'ai.properties.md');
  if (await pathExists(aiPropertiesInConfigDir)) {
    // We're already in the orchestrator
    return configDir;
  }
  
  // We're in a different repo, use .context-orchestrator
  return path.join(configDir, '.context-orchestrator');
}

/**
 * Get sessions directory from orchestrator
 */
async function getSessionsDir(): Promise<string | null> {
  const orchestratorPath = await getOrchestratorPath();
  if (!orchestratorPath) {
    return null;
  }
  
  return path.join(orchestratorPath, '.sessions');
}

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
    // If we're already in the orchestrator (has ai.properties.md), use configDir
    // Otherwise, use .context-orchestrator subdirectory
    let orchestratorPath: string;
    const aiPropertiesInConfigDir = path.join(configDir, 'ai.properties.md');
    
    if (await pathExists(aiPropertiesInConfigDir)) {
      // We're already in the orchestrator
      orchestratorPath = configDir;
      console.log(chalk.gray('✓ Running from orchestrator directory'));
    } else {
      // We're in a different repo, need to clone orchestrator
      orchestratorPath = path.join(configDir, '.context-orchestrator');
      
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

    // Select language for AI commands
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Select language for AI commands:',
        choices: [
          { name: '🇺🇸 English', value: 'en' },
          { name: '🇪🇸 Español', value: 'es' },
          { name: '🇧🇷 Português (Brasil)', value: 'pt-BR' },
        ],
        default: 'en',
      },
    ]);
    console.log(chalk.gray(`✓ Language: ${language}`));

    // Ask if user wants to copy .env files
    const { copyEnvFiles } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'copyEnvFiles',
        message: 'Copy .env* files from main repositories to worktrees?',
        default: true,
      },
    ]);

    // Create workspace directory in orchestrator/.sessions/
    const sessionsDir = path.join(orchestratorPath, '.sessions');
    await ensureDir(sessionsDir);
    
    const workspacePath = path.join(sessionsDir, issueId);
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

        // Copy .env* files if requested
        if (copyEnvFiles) {
          try {
            const envFiles = await fs.readdir(mainRepoPath);
            const envFilesToCopy = envFiles.filter(file => file.startsWith('.env'));
            
            if (envFilesToCopy.length > 0) {
              console.log(chalk.blue(`    Copying .env* files...`));
              for (const envFile of envFilesToCopy) {
                const sourcePath = path.join(mainRepoPath, envFile);
                const destPath = path.join(worktreePath, envFile);
                await fs.copyFile(sourcePath, destPath);
                console.log(chalk.gray(`      ✓ Copied ${envFile}`));
              }
            } else {
              console.log(chalk.gray(`    No .env* files found in ${repo.id}`));
            }
          } catch (error: any) {
            console.log(chalk.yellow(`    ⚠ Failed to copy .env files: ${error.message}`));
          }
        }
      } catch (error: any) {
        console.log(chalk.yellow(`    ⚠ Failed to create worktree: ${error.message}`));
      }
    }

    // Save workspace metadata
    const metadata: WorkspaceMetadata = {
      issueId,
      repositories: repoIds,
      language,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
    };
    await saveWorkspaceMetadata(workspacePath, metadata);

    // Generate docker-compose.yml
    console.log(chalk.blue('\nGenerating docker-compose.yml...'));
    await generateDockerCompose(workspacePath, issueId, selectedRepos);

    console.log(chalk.green.bold('\n✅ Workspace created successfully!'));
    console.log(chalk.blue('\n📁 Workspace location:'));
    console.log(chalk.white(`   ${workspacePath}`));
    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray(`   cd ${workspacePath}`));
    console.log(chalk.gray('   docker-compose up -d  # Start services'));
    console.log(chalk.gray('   code .'));
    console.log(chalk.gray('   # Start working on your feature!'));
  },

  list: async () => {
    console.log(chalk.blue.bold('\n📋 Active Feature Workspaces\n'));

    const sessionsDir = await getSessionsDir();
    if (!sessionsDir) {
      console.log(chalk.yellow('No configuration found. Run "context-cli init" first.'));
      return;
    }
    
    if (!(await pathExists(sessionsDir))) {
      console.log(chalk.yellow('No workspaces found. Create one with "context-cli feature start <issue-id>"'));
      return;
    }

    const entries = await fs.readdir(sessionsDir, { withFileTypes: true });
    const workspaceDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    if (workspaceDirs.length === 0) {
      console.log(chalk.yellow('No workspaces found.'));
      return;
    }

    const workspaces: Array<{ issueId: string; metadata: WorkspaceMetadata | null }> = [];
    
    for (const issueId of workspaceDirs) {
      const workspacePath = path.join(sessionsDir, issueId);
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
    const sessionsDir = await getSessionsDir();
    if (!sessionsDir) {
      exitWithError('No configuration found. Run "context-cli init" first.');
    }

    const workspacePath = path.join(sessionsDir, issueId);

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

    const sessionsDir = await getSessionsDir();
    if (!sessionsDir) {
      exitWithError('No configuration found. Run "context-cli init" first.');
    }

    const workspacePath = path.join(sessionsDir, issueId);

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

    // Cleanup Docker containers
    await cleanupDockerContainers(workspacePath, issueId);

    // Remove worktrees
    console.log(chalk.blue('Removing worktrees...'));
    
    // Load ai.properties to get base_path
    const configResult = await findConfig();
    if (configResult) {
      const { configDir } = configResult;
      
      // Determine orchestrator path (same logic as feature start)
      let orchestratorPath: string;
      const aiPropertiesInConfigDir = path.join(configDir, 'ai.properties.md');
      
      if (await pathExists(aiPropertiesInConfigDir)) {
        // We're already in the orchestrator
        orchestratorPath = configDir;
      } else {
        // We're in a different repo
        orchestratorPath = path.join(configDir, '.context-orchestrator');
      }
      
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

    // Prune orphaned worktrees in all repositories
    console.log(chalk.blue('Pruning orphaned worktrees...'));
    if (configResult) {
      const { configDir } = configResult;
      let orchestratorPath: string;
      const aiPropertiesInConfigDir = path.join(configDir, 'ai.properties.md');
      
      if (await pathExists(aiPropertiesInConfigDir)) {
        orchestratorPath = configDir;
      } else {
        orchestratorPath = path.join(configDir, '.context-orchestrator');
      }
      
      const aiProperties = await loadAiProperties(orchestratorPath);
      const basePath = getBasePath(aiProperties);
      
      if (basePath) {
        for (const repoId of metadata.repositories) {
          const mainRepoPath = path.join(basePath, repoId);
          if (await pathExists(mainRepoPath)) {
            try {
              const { execSync } = require('child_process');
              execSync('git worktree prune', { cwd: mainRepoPath, stdio: 'pipe' });
              console.log(chalk.gray(`  Pruned worktrees in ${repoId}`));
            } catch (error: any) {
              // Ignore prune errors
            }
          }
        }
      }
    }
    
    // Remove workspace directory
    console.log(chalk.blue('Removing workspace directory...'));
    console.log(chalk.gray(`  Path: ${workspacePath}`));
    
    try {
      await fs.rm(workspacePath, { recursive: true, force: true });
      
      // Verify deletion
      const stillExists = await pathExists(workspacePath);
      if (stillExists) {
        console.log(chalk.yellow(`  Warning: Directory still exists after deletion attempt`));
        // Try alternative deletion method
        const { execSync } = require('child_process');
        execSync(`rm -rf "${workspacePath}"`);
      }
      
      console.log(chalk.green(`\n✅ Workspace ${issueId} removed successfully`));
    } catch (error: any) {
      console.log(chalk.red(`  Error removing directory: ${error.message}`));
      throw error;
    }
  },

  status: async (issueId?: string) => {
    const sessionsDir = await getSessionsDir();
    if (!sessionsDir) {
      exitWithError('No configuration found. Run "context-cli init" first.');
    }
    
    if (issueId) {
      // Show status for specific workspace
      const workspacePath = path.join(sessionsDir, issueId);
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
      
      // Check if we're in a .sessions workspace
      if (cwd.includes('.sessions')) {
        const parts = cwd.split(path.sep);
        const sessionIndex = parts.indexOf('.sessions');
        if (sessionIndex >= 0 && parts.length > sessionIndex + 1) {
          const currentIssueId = parts[sessionIndex + 1];
          await featureCommands.status(currentIssueId);
          return;
        }
      }

      console.log(chalk.yellow('Not in a feature workspace. Use "context-cli feature list" to see all workspaces.'));
    }
  },

  merge: async (issueId: string, options: { targetBranch?: string; noPush?: boolean; keepWorkspace?: boolean; force?: boolean }) => {
    console.log(chalk.blue.bold(`\n🔀 Merging feature: ${issueId}\n`));

    const sessionsDir = await getSessionsDir();
    if (!sessionsDir) {
      exitWithError('No configuration found. Run "context-cli init" first.');
    }

    const workspacePath = path.join(sessionsDir, issueId);

    if (!(await pathExists(workspacePath))) {
      exitWithError(`Workspace for ${issueId} not found`);
    }

    // Load metadata to get repository list
    const metadata = await loadWorkspaceMetadata(workspacePath);
    if (!metadata) {
      exitWithError('Could not load workspace metadata');
    }

    const targetBranch = options.targetBranch || 'main';
    const branchName = `feature/${issueId}`;

    // Confirm merge
    if (!options.force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Merge ${branchName} into ${targetBranch} in ${metadata.repositories.length} repository(ies)?`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow('✋ Merge cancelled'));
        return;
      }
    }

    // Load ai.properties to get base_path
    const configResult = await findConfig();
    if (!configResult) {
      exitWithError('No configuration found');
    }

    const { configDir } = configResult;
    
    // Determine orchestrator path
    let orchestratorPath: string;
    const aiPropertiesInConfigDir = path.join(configDir, 'ai.properties.md');
    
    if (await pathExists(aiPropertiesInConfigDir)) {
      orchestratorPath = configDir;
    } else {
      orchestratorPath = path.join(configDir, '.context-orchestrator');
    }
    
    const aiProperties = await loadAiProperties(orchestratorPath);
    const basePath = getBasePath(aiProperties);
    
    if (!basePath) {
      exitWithError('Could not determine base_path from ai.properties.md');
    }

    // Merge each repository
    console.log(chalk.blue(`\nMerging ${branchName} into ${targetBranch}...\n`));
    
    const mergeErrors: string[] = [];
    
    for (const repoId of metadata.repositories) {
      const mainRepoPath = path.join(basePath, repoId);
      
      if (!(await pathExists(mainRepoPath))) {
        console.log(chalk.yellow(`  ⚠ Repository ${repoId} not found at ${mainRepoPath}, skipping`));
        continue;
      }

      try {
        console.log(chalk.gray(`  Processing ${repoId}...`));
        
        // Merge branch FIRST (while worktree still exists for conflict resolution)
        await mergeBranch(mainRepoPath, branchName, targetBranch);
        console.log(chalk.green(`    ✓ Merged ${branchName} into ${targetBranch}`));
        
        // Push if not disabled
        if (!options.noPush) {
          await pushBranch(mainRepoPath, targetBranch);
          console.log(chalk.green(`    ✓ Pushed ${targetBranch}`));
        }
        
        // Delete feature branch
        await deleteBranch(mainRepoPath, branchName, true);
        console.log(chalk.green(`    ✓ Deleted branch ${branchName}`));
        
        // Remove worktree AFTER successful merge
        const worktreePath = path.join(workspacePath, repoId);
        if (await pathExists(worktreePath)) {
          console.log(chalk.gray(`    Removing worktree at ${worktreePath}...`));
          await removeWorktree(mainRepoPath, worktreePath);
          console.log(chalk.green(`    ✓ Removed worktree`));
        }
        
      } catch (error: any) {
        console.log(chalk.red(`  ✗ Error in ${repoId}: ${error.message}`));
        mergeErrors.push(`${repoId}: ${error.message}`);
      }
    }

    if (mergeErrors.length > 0) {
      console.log(chalk.red.bold('\n⚠️ Merge completed with errors:\n'));
      mergeErrors.forEach(err => console.log(chalk.red(`  - ${err}`)));
      console.log(chalk.yellow('\n💡 Worktrees were preserved to allow conflict resolution!'));
      console.log(chalk.gray('\nTo resolve conflicts:'));
      console.log(chalk.gray(`  1. cd ${workspacePath}/<repo-with-conflict>`));
      console.log(chalk.gray('  2. Resolve conflicts with your AI assistant'));
      console.log(chalk.gray('  3. git add . && git commit'));
      console.log(chalk.gray('  4. git push'));
      console.log(chalk.gray(`  5. Re-run: context-cli feature merge ${issueId}`));
      return;
    }

    console.log(chalk.green.bold('\n✅ Merge completed successfully!'));

    // Remove workspace if not disabled
    if (!options.keepWorkspace) {
      console.log(chalk.blue('\nCleaning up workspace...'));
      await featureCommands.remove(issueId, { force: true });
    } else {
      console.log(chalk.blue('\n💾 Workspace preserved (use --keep-workspace=false to remove)'));
    }

    console.log(chalk.green.bold('\n🎉 Feature merged successfully!'));
    
    if (!options.noPush) {
      console.log(chalk.gray(`\n💡 Changes have been pushed to ${targetBranch}`));
    } else {
      console.log(chalk.yellow(`\n⚠️ Remember to push ${targetBranch} manually (--no-push was used)`));
    }
  },

  end: async (issueId: string, options: { force?: boolean }) => {
    // Alias for remove command
    await featureCommands.remove(issueId, options);
  },
};
