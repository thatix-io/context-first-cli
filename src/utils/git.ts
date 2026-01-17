import simpleGit, { SimpleGit } from 'simple-git';
import { execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';

/**
 * Clone a repository if it doesn't exist
 */
export async function ensureRepoCloned(repoUrl: string, targetPath: string): Promise<void> {
  const git: SimpleGit = simpleGit();
  
  try {
    await git.clone(repoUrl, targetPath);
    console.log(chalk.green(`✓ Cloned ${repoUrl}`));
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log(chalk.gray(`  Repository already exists at ${targetPath}`));
    } else {
      throw error;
    }
  }
}

/**
 * Create a git worktree
 */
export async function createWorktree(
  mainRepoPath: string,
  worktreePath: string,
  branchName: string
): Promise<void> {
  const git: SimpleGit = simpleGit(mainRepoPath);
  
  // Check if branch exists remotely or locally
  const branches = await git.branch();
  const branchExists = branches.all.includes(branchName) || branches.all.includes(`remotes/origin/${branchName}`);
  
  if (!branchExists) {
    // Create new branch from current HEAD
    await git.checkoutLocalBranch(branchName);
    console.log(chalk.gray(`  Created new branch: ${branchName}`));
  }
  
  // Create worktree
  console.log(chalk.gray(`    Executing: git worktree add "${worktreePath}" "${branchName}"`));
  console.log(chalk.gray(`    Working directory: ${mainRepoPath}`));
  
  try {
    const output = execSync(`git worktree add "${worktreePath}" "${branchName}"`, {
      cwd: mainRepoPath,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    console.log(chalk.green(`    ✓ Created worktree at ${worktreePath}`));
    if (output) {
      console.log(chalk.gray(`    Git output: ${output.toString().trim()}`));
    }
  } catch (error: any) {
    console.log(chalk.red(`    ✗ Failed to create worktree`));
    console.log(chalk.red(`    Error: ${error.message}`));
    if (error.stderr) {
      console.log(chalk.red(`    Stderr: ${error.stderr.toString()}`));
    }
    if (error.stdout) {
      console.log(chalk.gray(`    Stdout: ${error.stdout.toString()}`));
    }
    
    if (error.message.includes('already exists')) {
      console.log(chalk.yellow(`    Worktree already exists at ${worktreePath}`));
    } else {
      throw error;
    }
  }
}

/**
 * Remove a git worktree
 */
export async function removeWorktree(mainRepoPath: string, worktreePath: string): Promise<void> {
  try {
    execSync(`git worktree remove "${worktreePath}" --force`, {
      cwd: mainRepoPath,
      stdio: 'pipe',
    });
    console.log(chalk.green(`✓ Removed worktree at ${worktreePath}`));
  } catch (error: any) {
    console.log(chalk.yellow(`  Could not remove worktree: ${error.message}`));
  }
}

/**
 * List all worktrees for a repository
 */
export async function listWorktrees(mainRepoPath: string): Promise<string[]> {
  try {
    const output = execSync('git worktree list --porcelain', {
      cwd: mainRepoPath,
      encoding: 'utf-8',
    });
    
    const worktrees: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('worktree ')) {
        worktrees.push(line.substring(9));
      }
    }
    
    return worktrees;
  } catch (error) {
    return [];
  }
}

/**
 * Get the current branch name
 */
export async function getCurrentBranch(repoPath: string): Promise<string | null> {
  try {
    const git: SimpleGit = simpleGit(repoPath);
    const status = await git.status();
    return status.current || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get repository status
 */
export async function getRepoStatus(repoPath: string): Promise<{
  branch: string | null;
  modified: number;
  staged: number;
  ahead: number;
  behind: number;
}> {
  try {
    const git: SimpleGit = simpleGit(repoPath);
    const status = await git.status();
    
    return {
      branch: status.current || null,
      modified: status.modified.length + status.created.length + status.deleted.length,
      staged: status.staged.length,
      ahead: status.ahead,
      behind: status.behind,
    };
  } catch (error) {
    return {
      branch: null,
      modified: 0,
      staged: 0,
      ahead: 0,
      behind: 0,
    };
  }
}

/**
 * Check if a path is a git repository
 */
export async function isGitRepo(repoPath: string): Promise<boolean> {
  try {
    const git: SimpleGit = simpleGit(repoPath);
    await git.status();
    return true;
  } catch (error) {
    return false;
  }
}
