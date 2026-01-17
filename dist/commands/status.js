"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
const git_1 = require("../utils/git");
async function statusCommand() {
    console.log(chalk_1.default.blue.bold('\n📊 Workspace Status\n'));
    // Try to find workspace metadata in current directory or parent
    const metadata = await (0, config_1.loadWorkspaceMetadata)(process.cwd());
    if (!metadata) {
        // Check if we're inside a workspace by looking for .workspace.json in parent directories
        let currentDir = process.cwd();
        let workspaceRoot = null;
        while (true) {
            const metadataPath = path_1.default.join(currentDir, '.workspace.json');
            if (await (0, config_1.pathExists)(metadataPath)) {
                workspaceRoot = currentDir;
                break;
            }
            const parentDir = path_1.default.dirname(currentDir);
            if (parentDir === currentDir) {
                // Reached root
                break;
            }
            currentDir = parentDir;
        }
        if (!workspaceRoot) {
            (0, config_1.exitWithError)('Not inside a workspace. Run this command from within a feature workspace.');
        }
        const workspaceMetadata = await (0, config_1.loadWorkspaceMetadata)(workspaceRoot);
        if (!workspaceMetadata) {
            (0, config_1.exitWithError)('Could not load workspace metadata');
        }
        await displayStatus(workspaceRoot, workspaceMetadata);
    }
    else {
        await displayStatus(process.cwd(), metadata);
    }
}
async function displayStatus(workspaceRoot, metadata) {
    // Display workspace info
    console.log(chalk_1.default.bold('Workspace Information:'));
    console.log(chalk_1.default.gray(`  Issue ID: ${chalk_1.default.cyan(metadata.issueId)}`));
    console.log(chalk_1.default.gray(`  Created: ${new Date(metadata.createdAt).toLocaleString()}`));
    console.log(chalk_1.default.gray(`  Last Updated: ${new Date(metadata.lastUpdated).toLocaleString()}`));
    console.log(chalk_1.default.gray(`  Status: ${metadata.status === 'active' ? chalk_1.default.green('active') : chalk_1.default.gray('archived')}`));
    console.log(chalk_1.default.gray(`  Location: ${workspaceRoot}`));
    // Display repository statuses
    console.log(chalk_1.default.bold('\n📦 Repositories:\n'));
    for (const repoId of metadata.repositories) {
        const repoPath = path_1.default.join(workspaceRoot, repoId);
        if (!(await (0, config_1.pathExists)(repoPath))) {
            console.log(chalk_1.default.yellow(`  ${repoId}: Directory not found`));
            continue;
        }
        const status = await (0, git_1.getRepoStatus)(repoPath);
        console.log(chalk_1.default.cyan(`  ${repoId}:`));
        console.log(chalk_1.default.gray(`    Branch: ${status.branch || 'unknown'}`));
        if (status.modified > 0) {
            console.log(chalk_1.default.yellow(`    Modified files: ${status.modified}`));
        }
        else {
            console.log(chalk_1.default.gray(`    Modified files: 0`));
        }
        if (status.staged > 0) {
            console.log(chalk_1.default.green(`    Staged files: ${status.staged}`));
        }
        else {
            console.log(chalk_1.default.gray(`    Staged files: 0`));
        }
        if (status.ahead > 0) {
            console.log(chalk_1.default.blue(`    Commits ahead: ${status.ahead}`));
        }
        if (status.behind > 0) {
            console.log(chalk_1.default.yellow(`    Commits behind: ${status.behind}`));
        }
        console.log('');
    }
    // Summary
    const allStatuses = await Promise.all(metadata.repositories.map(async (repoId) => {
        const repoPath = path_1.default.join(workspaceRoot, repoId);
        if (await (0, config_1.pathExists)(repoPath)) {
            return await (0, git_1.getRepoStatus)(repoPath);
        }
        return null;
    }));
    const totalModified = allStatuses.reduce((sum, s) => sum + (s?.modified || 0), 0);
    const totalStaged = allStatuses.reduce((sum, s) => sum + (s?.staged || 0), 0);
    console.log(chalk_1.default.bold('Summary:'));
    if (totalModified > 0 || totalStaged > 0) {
        console.log(chalk_1.default.yellow(`  You have ${totalModified} modified and ${totalStaged} staged files across all repositories.`));
    }
    else {
        console.log(chalk_1.default.green('  All repositories are clean.'));
    }
}
//# sourceMappingURL=status.js.map