"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRepoBranchCommand = setRepoBranchCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function setRepoBranchCommand(repoId) {
    console.log(chalk_1.default.blue.bold('\n🌿 Update main branch for a repository\n'));
    try {
        const manifestPath = path_1.default.join(process.cwd(), 'context-manifest.json');
        const exists = await promises_1.default.access(manifestPath).then(() => true).catch(() => false);
        if (!exists) {
            console.log(chalk_1.default.red('\n❌ context-manifest.json not found in current directory'));
            console.log(chalk_1.default.gray('Make sure you are in an orchestrator repository root'));
            return;
        }
        const manifestContent = await promises_1.default.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        if (manifest.repositories.length === 0) {
            console.log(chalk_1.default.yellow('\n⚠️  No repositories found in context-manifest.json'));
            return;
        }
        let targetRepoId = repoId;
        if (!targetRepoId) {
            const { selectedRepo } = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'selectedRepo',
                    message: 'Select the repository to update:',
                    choices: manifest.repositories.map(r => ({
                        name: `${r.id} (current: ${r.mainBranch || 'main'})`,
                        value: r.id,
                    })),
                },
            ]);
            targetRepoId = selectedRepo;
        }
        const repoIndex = manifest.repositories.findIndex(r => r.id === targetRepoId);
        if (repoIndex === -1) {
            console.log(chalk_1.default.red(`\n❌ Repository "${targetRepoId}" not found in context-manifest.json`));
            return;
        }
        const currentBranch = manifest.repositories[repoIndex].mainBranch || 'main';
        const { newBranch } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'newBranch',
                message: `New main branch for "${targetRepoId}":`,
                default: currentBranch,
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Branch name is required';
                    }
                    return true;
                },
            },
        ]);
        manifest.repositories[repoIndex].mainBranch = newBranch;
        await promises_1.default.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(chalk_1.default.green(`\n✅ Main branch for "${targetRepoId}" updated to "${newBranch}"`));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error updating repository branch:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=set-repo-branch.js.map