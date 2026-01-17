import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import {
  loadWorkspaceMetadata,
  pathExists,
  exitWithError,
} from '../utils/config';
import { getRepoStatus } from '../utils/git';

export async function statusCommand() {
  console.log(chalk.blue.bold('\n📊 Workspace Status\n'));

  // Try to find workspace metadata in current directory or parent
  const metadata = await loadWorkspaceMetadata(process.cwd());
  
  if (!metadata) {
    // Check if we're inside a workspace by looking for .workspace.json in parent directories
    let currentDir = process.cwd();
    let workspaceRoot: string | null = null;
    
    while (true) {
      const metadataPath = path.join(currentDir, '.workspace.json');
      if (await pathExists(metadataPath)) {
        workspaceRoot = currentDir;
        break;
      }
      
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached root
        break;
      }
      currentDir = parentDir;
    }
    
    if (!workspaceRoot) {
      exitWithError('Not inside a workspace. Run this command from within a feature workspace.');
    }
    
    const workspaceMetadata = await loadWorkspaceMetadata(workspaceRoot);
    if (!workspaceMetadata) {
      exitWithError('Could not load workspace metadata');
    }
    
    await displayStatus(workspaceRoot, workspaceMetadata);
  } else {
    await displayStatus(process.cwd(), metadata);
  }
}

async function displayStatus(workspaceRoot: string, metadata: any) {
  // Display workspace info
  console.log(chalk.bold('Workspace Information:'));
  console.log(chalk.gray(`  Issue ID: ${chalk.cyan(metadata.issueId)}`));
  console.log(chalk.gray(`  Created: ${new Date(metadata.createdAt).toLocaleString()}`));
  console.log(chalk.gray(`  Last Updated: ${new Date(metadata.lastUpdated).toLocaleString()}`));
  console.log(chalk.gray(`  Status: ${metadata.status === 'active' ? chalk.green('active') : chalk.gray('archived')}`));
  console.log(chalk.gray(`  Location: ${workspaceRoot}`));

  // Display repository statuses
  console.log(chalk.bold('\n📦 Repositories:\n'));

  for (const repoId of metadata.repositories) {
    const repoPath = path.join(workspaceRoot, repoId);
    
    if (!(await pathExists(repoPath))) {
      console.log(chalk.yellow(`  ${repoId}: Directory not found`));
      continue;
    }

    const status = await getRepoStatus(repoPath);
    
    console.log(chalk.cyan(`  ${repoId}:`));
    console.log(chalk.gray(`    Branch: ${status.branch || 'unknown'}`));
    
    if (status.modified > 0) {
      console.log(chalk.yellow(`    Modified files: ${status.modified}`));
    } else {
      console.log(chalk.gray(`    Modified files: 0`));
    }
    
    if (status.staged > 0) {
      console.log(chalk.green(`    Staged files: ${status.staged}`));
    } else {
      console.log(chalk.gray(`    Staged files: 0`));
    }
    
    if (status.ahead > 0) {
      console.log(chalk.blue(`    Commits ahead: ${status.ahead}`));
    }
    
    if (status.behind > 0) {
      console.log(chalk.yellow(`    Commits behind: ${status.behind}`));
    }
    
    console.log('');
  }

  // Summary
  const allStatuses = await Promise.all(
    metadata.repositories.map(async (repoId: string) => {
      const repoPath = path.join(workspaceRoot, repoId);
      if (await pathExists(repoPath)) {
        return await getRepoStatus(repoPath);
      }
      return null;
    })
  );

  const totalModified = allStatuses.reduce((sum, s) => sum + (s?.modified || 0), 0);
  const totalStaged = allStatuses.reduce((sum, s) => sum + (s?.staged || 0), 0);

  console.log(chalk.bold('Summary:'));
  if (totalModified > 0 || totalStaged > 0) {
    console.log(chalk.yellow(`  You have ${totalModified} modified and ${totalStaged} staged files across all repositories.`));
  } else {
    console.log(chalk.green('  All repositories are clean.'));
  }
}
