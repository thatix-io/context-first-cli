/**
 * Clone a repository if it doesn't exist
 */
export declare function ensureRepoCloned(repoUrl: string, targetPath: string): Promise<void>;
/**
 * Create a git worktree
 */
export declare function createWorktree(mainRepoPath: string, worktreePath: string, branchName: string): Promise<void>;
/**
 * Remove a git worktree
 */
export declare function removeWorktree(mainRepoPath: string, worktreePath: string): Promise<void>;
/**
 * List all worktrees for a repository
 */
export declare function listWorktrees(mainRepoPath: string): Promise<string[]>;
/**
 * Get the current branch name
 */
export declare function getCurrentBranch(repoPath: string): Promise<string | null>;
/**
 * Get repository status
 */
export declare function getRepoStatus(repoPath: string): Promise<{
    branch: string | null;
    modified: number;
    staged: number;
    ahead: number;
    behind: number;
}>;
/**
 * Check if a path is a git repository
 */
export declare function isGitRepo(repoPath: string): Promise<boolean>;
/**
 * Merge a branch into target branch
 */
export declare function mergeBranch(repoPath: string, sourceBranch: string, targetBranch?: string): Promise<void>;
/**
 * Push branch to remote
 */
export declare function pushBranch(repoPath: string, branch: string, remote?: string): Promise<void>;
/**
 * Delete a local branch
 */
export declare function deleteBranch(repoPath: string, branchName: string, force?: boolean): Promise<void>;
//# sourceMappingURL=git.d.ts.map