"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRepoMetaspecCommand = addRepoMetaspecCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function addRepoMetaspecCommand() {
    console.log(chalk_1.default.blue.bold('\n📚 Adding MetaSpecs repository to context-manifest.json\n'));
    try {
        // Check if context-manifest.json exists
        const manifestPath = path_1.default.join(process.cwd(), 'context-manifest.json');
        const exists = await promises_1.default.access(manifestPath).then(() => true).catch(() => false);
        if (!exists) {
            console.log(chalk_1.default.red('\n❌ context-manifest.json not found in current directory'));
            console.log(chalk_1.default.gray('Make sure you are in an orchestrator repository root'));
            return;
        }
        // Read existing manifest
        const manifestContent = await promises_1.default.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        // Check if metaspecs already exists
        const metaspecsExists = manifest.repositories.some(r => r.role === 'specs-provider' || r.id === 'metaspecs');
        if (metaspecsExists) {
            console.log(chalk_1.default.yellow('\n⚠️  A MetaSpecs repository already exists in the manifest'));
            const { proceed } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'Do you want to replace it?',
                    default: false,
                },
            ]);
            if (!proceed) {
                console.log(chalk_1.default.gray('\nOperation cancelled'));
                return;
            }
            // Remove existing metaspecs
            manifest.repositories = manifest.repositories.filter(r => r.role !== 'specs-provider' && r.id !== 'metaspecs');
        }
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'url',
                message: 'MetaSpecs repository URL (Git):',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Repository URL is required';
                    }
                    if (!input.includes('git') && !input.includes('.git')) {
                        return 'Please provide a valid Git repository URL';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'id',
                message: 'Repository folder name (must match the local directory name in base_path):',
                default: 'metaspecs',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Folder name is required';
                    }
                    if (input.includes('/') || input.includes('\\')) {
                        return 'Folder name cannot contain path separators';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Repository description:',
                default: 'MetaSpecs repository with technical and business specifications',
            },
        ]);
        // Create metaspecs repository entry
        const metaspecsRepo = {
            id: answers.id,
            role: 'specs-provider',
            url: answers.url,
            description: answers.description,
        };
        // Add to beginning of repositories array (metaspecs should be first)
        manifest.repositories.unshift(metaspecsRepo);
        // Write back to file
        await promises_1.default.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(chalk_1.default.green('\n✅ MetaSpecs repository added successfully!'));
        console.log(chalk_1.default.blue('\n📝 Repository details:'));
        console.log(chalk_1.default.gray(`  ID: ${answers.id}`));
        console.log(chalk_1.default.gray(`  Role: specs-provider`));
        console.log(chalk_1.default.gray(`  URL: ${answers.url}`));
        console.log(chalk_1.default.gray(`  Description: ${answers.description}`));
        console.log(chalk_1.default.blue('\n💡 Next step:'));
        console.log(chalk_1.default.gray('  Update ai.properties.md with the local path to your cloned MetaSpecs repository'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error adding MetaSpecs repository:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=add-repo-metaspec.js.map