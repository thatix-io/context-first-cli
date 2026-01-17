"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureRepoCloned = ensureRepoCloned;
exports.createWorktree = createWorktree;
exports.removeWorktree = removeWorktree;
exports.listWorktrees = listWorktrees;
exports.getCurrentBranch = getCurrentBranch;
exports.getRepoStatus = getRepoStatus;
exports.isGitRepo = isGitRepo;
const simple_git_1 = __importDefault(require("simple-git"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Clone a repository if it doesn't exist
 */
async function ensureRepoCloned(repoUrl, targetPath) {
    const git = (0, simple_git_1.default)();
    try {
        await git.clone(repoUrl, targetPath);
        console.log(chalk_1.default.green(`✓ Cloned ${repoUrl}`));
    }
    catch (error) {
        if (error.message.includes('already exists')) {
            console.log(chalk_1.default.gray(`  Repository already exists at ${targetPath}`));
        }
        else {
            throw error;
        }
    }
}
/**
 * Create a git worktree
 */
async function createWorktree(mainRepoPath, worktreePath, branchName) {
    const git = (0, simple_git_1.default)(mainRepoPath);
    // Check if branch exists remotely or locally
    const branches = await git.branch();
    const branchExists = branches.all.includes(branchName) || branches.all.includes(`remotes/origin/${branchName}`);
    if (!branchExists) {
        // Create new branch from current HEAD
        await git.checkoutLocalBranch(branchName);
        console.log(chalk_1.default.gray(`  Created new branch: ${branchName}`));
    }
    // Create worktree
    console.log(chalk_1.default.gray(`    Executing: git worktree add "${worktreePath}" "${branchName}"`));
    console.log(chalk_1.default.gray(`    Working directory: ${mainRepoPath}`));
    try {
        const output = (0, child_process_1.execSync)(`git worktree add "${worktreePath}" "${branchName}"`, {
            cwd: mainRepoPath,
            stdio: 'pipe',
            encoding: 'utf-8',
        });
        console.log(chalk_1.default.green(`    ✓ Created worktree at ${worktreePath}`));
        if (output) {
            console.log(chalk_1.default.gray(`    Git output: ${output.toString().trim()}`));
        }
    }
    catch (error) {
        console.log(chalk_1.default.red(`    ✗ Failed to create worktree`));
        console.log(chalk_1.default.red(`    Error: ${error.message}`));
        if (error.stderr) {
            console.log(chalk_1.default.red(`    Stderr: ${error.stderr.toString()}`));
        }
        if (error.stdout) {
            console.log(chalk_1.default.gray(`    Stdout: ${error.stdout.toString()}`));
        }
        if (error.message.includes('already exists')) {
            console.log(chalk_1.default.yellow(`    Worktree already exists at ${worktreePath}`));
        }
        else {
            throw error;
        }
    }
}
/**
 * Remove a git worktree
 */
async function removeWorktree(mainRepoPath, worktreePath) {
    try {
        (0, child_process_1.execSync)(`git worktree remove "${worktreePath}" --force`, {
            cwd: mainRepoPath,
            stdio: 'pipe',
        });
        console.log(chalk_1.default.green(`✓ Removed worktree at ${worktreePath}`));
    }
    catch (error) {
        console.log(chalk_1.default.yellow(`  Could not remove worktree: ${error.message}`));
    }
}
/**
 * List all worktrees for a repository
 */
async function listWorktrees(mainRepoPath) {
    try {
        const output = (0, child_process_1.execSync)('git worktree list --porcelain', {
            cwd: mainRepoPath,
            encoding: 'utf-8',
        });
        const worktrees = [];
        const lines = output.split('\n');
        for (const line of lines) {
            if (line.startsWith('worktree ')) {
                worktrees.push(line.substring(9));
            }
        }
        return worktrees;
    }
    catch (error) {
        return [];
    }
}
/**
 * Get the current branch name
 */
async function getCurrentBranch(repoPath) {
    try {
        const git = (0, simple_git_1.default)(repoPath);
        const status = await git.status();
        return status.current || null;
    }
    catch (error) {
        return null;
    }
}
/**
 * Get repository status
 */
async function getRepoStatus(repoPath) {
    try {
        const git = (0, simple_git_1.default)(repoPath);
        const status = await git.status();
        return {
            branch: status.current || null,
            modified: status.modified.length + status.created.length + status.deleted.length,
            staged: status.staged.length,
            ahead: status.ahead,
            behind: status.behind,
        };
    }
    catch (error) {
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
async function isGitRepo(repoPath) {
    try {
        const git = (0, simple_git_1.default)(repoPath);
        await git.status();
        return true;
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=git.js.map