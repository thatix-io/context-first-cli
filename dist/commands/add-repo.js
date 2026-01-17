"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRepoCommand = addRepoCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function addRepoCommand() {
    console.log(chalk_1.default.blue.bold('\n📦 Adding a new repository to context-manifest.json\n'));
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
        // Get repository IDs for dependencies
        const existingRepoIds = manifest.repositories.map(r => r.id);
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Repository ID (unique identifier):',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Repository ID is required';
                    }
                    if (!/^[a-z0-9-]+$/.test(input)) {
                        return 'Repository ID must contain only lowercase letters, numbers, and hyphens';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'url',
                message: 'Repository URL (Git):',
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
                name: 'description',
                message: 'Repository description:',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Description is required';
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'role',
                message: 'Repository role:',
                choices: [
                    { name: 'Application (main code repository)', value: 'application' },
                    { name: 'Library (shared library)', value: 'library' },
                    { name: 'Service (microservice)', value: 'service' },
                    { name: 'Tool (development tool)', value: 'tool' },
                    { name: 'Other', value: 'other' },
                ],
                default: 'application',
            },
            {
                type: 'checkbox',
                name: 'dependsOn',
                message: 'Dependencies (select repositories this one depends on):',
                choices: existingRepoIds.map(id => ({ name: id, value: id })),
                when: () => existingRepoIds.length > 0,
            },
        ]);
        // Check if repository already exists
        const existingIndex = manifest.repositories.findIndex(r => r.id === answers.id);
        if (existingIndex !== -1) {
            console.log(chalk_1.default.yellow(`\n⚠️  Repository "${answers.id}" already exists in the manifest`));
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
            // Remove existing repository
            manifest.repositories.splice(existingIndex, 1);
        }
        // Create new repository entry
        const newRepo = {
            id: answers.id,
            role: answers.role,
            url: answers.url,
            description: answers.description,
        };
        if (answers.dependsOn && answers.dependsOn.length > 0) {
            newRepo.dependsOn = answers.dependsOn;
        }
        // Add to manifest
        manifest.repositories.push(newRepo);
        // Write back to file
        await promises_1.default.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
        console.log(chalk_1.default.green(`\n✅ Repository "${answers.id}" added successfully!`));
        console.log(chalk_1.default.blue('\n📝 Repository details:'));
        console.log(chalk_1.default.gray(`  ID: ${answers.id}`));
        console.log(chalk_1.default.gray(`  Role: ${answers.role}`));
        console.log(chalk_1.default.gray(`  URL: ${answers.url}`));
        if (newRepo.dependsOn && newRepo.dependsOn.length > 0) {
            console.log(chalk_1.default.gray(`  Dependencies: ${newRepo.dependsOn.join(', ')}`));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error adding repository:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=add-repo.js.map