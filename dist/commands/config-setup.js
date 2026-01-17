"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSetupCommand = configSetupCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
async function configSetupCommand() {
    console.log(chalk_1.default.blue.bold('\n⚙️  Setting up ai.properties.md configuration\n'));
    try {
        // Check if we're in an orchestrator directory
        const manifestPath = path_1.default.join(process.cwd(), 'context-manifest.json');
        const manifestExists = await promises_1.default.access(manifestPath).then(() => true).catch(() => false);
        if (!manifestExists) {
            console.log(chalk_1.default.red('\n❌ context-manifest.json not found'));
            console.log(chalk_1.default.gray('This command must be run from an orchestrator repository root'));
            console.log(chalk_1.default.gray('Hint: Run this after creating an orchestrator with create:orchestrator'));
            return;
        }
        // Read manifest to get repository list
        const manifestContent = await promises_1.default.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestContent);
        console.log(chalk_1.default.gray(`Found ${manifest.repositories.length} repositories in manifest\n`));
        // Check if ai.properties.md already exists
        const propsPath = path_1.default.join(process.cwd(), 'ai.properties.md');
        const propsExists = await promises_1.default.access(propsPath).then(() => true).catch(() => false);
        if (propsExists) {
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'ai.properties.md already exists. Do you want to overwrite it?',
                    default: false,
                },
            ]);
            if (!overwrite) {
                console.log(chalk_1.default.gray('\nOperation cancelled'));
                return;
            }
        }
        // Get base workspace path
        const defaultBasePath = path_1.default.join(os_1.default.homedir(), 'workspace');
        const baseAnswers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'basePath',
                message: 'Base workspace path (where repositories will be cloned):',
                default: defaultBasePath,
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Base path is required';
                    }
                    return true;
                },
            },
            {
                type: 'confirm',
                name: 'autoClone',
                message: 'Automatically clone missing repositories?',
                default: true,
            },
        ]);
        // Get task manager configuration
        console.log(chalk_1.default.blue('\n🎯 Task Manager Configuration:\n'));
        const taskAnswers = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'taskManager',
                message: 'Select your task management system:',
                choices: ['jira', 'linear', 'github', 'none'],
            },
            {
                type: 'input',
                name: 'jiraSite',
                message: 'Jira site URL (e.g., https://your-org.atlassian.net):',
                when: (answers) => answers.taskManager === 'jira',
            },
            {
                type: 'input',
                name: 'jiraProject',
                message: 'Jira project key (e.g., PROJ):',
                when: (answers) => answers.taskManager === 'jira',
            },
            {
                type: 'input',
                name: 'linearTeam',
                message: 'Linear team ID:',
                when: (answers) => answers.taskManager === 'linear',
            },
            {
                type: 'input',
                name: 'githubRepo',
                message: 'GitHub repository (e.g., owner/repo):',
                when: (answers) => answers.taskManager === 'github',
            },
        ]);
        // Generate ai.properties.md content
        let content = `# AI Properties Configuration\n\n`;
        content += `> This file contains local paths and configurations specific to your development environment.\n`;
        content += `> It is gitignored and should not be committed to version control.\n\n`;
        content += `## Project Information\n\n`;
        content += `project_name=${manifest.project}\n`;
        content += `project_description=${manifest.description}\n\n`;
        content += `## Repository Configuration\n\n`;
        content += `# Base path where all repositories will be cloned\n`;
        content += `# Each repository will be at: {base_path}/{repository-id}/\n`;
        content += `base_path=${baseAnswers.basePath}\n\n`;
        content += `# Automatically clone repositories if they don't exist\n`;
        content += `auto_clone=${baseAnswers.autoClone}\n`;
        content += `\n## Task Management\n\n`;
        content += `task_management_system=${taskAnswers.taskManager}\n`;
        if (taskAnswers.taskManager === 'jira') {
            content += `jira_site=${taskAnswers.jiraSite}\n`;
            content += `jira_project=${taskAnswers.jiraProject}\n`;
        }
        else if (taskAnswers.taskManager === 'linear') {
            content += `linear_team=${taskAnswers.linearTeam}\n`;
        }
        else if (taskAnswers.taskManager === 'github') {
            content += `github_repo=${taskAnswers.githubRepo}\n`;
        }
        content += `\n## Repository Commands\n\n`;
        content += `# Define commands for each repository (lint, test, build, etc.)\n`;
        content += `# Example:\n`;
        content += `# backend.lint_command=npm run lint\n`;
        content += `# backend.test_command=npm run test\n`;
        content += `# backend.build_command=npm run build\n\n`;
        for (const repo of manifest.repositories) {
            if (repo.role !== 'specs-provider') {
                content += `${repo.id}.lint_command=\n`;
                content += `${repo.id}.test_command=\n`;
                content += `${repo.id}.build_command=\n\n`;
            }
        }
        // Write ai.properties.md
        await promises_1.default.writeFile(propsPath, content, 'utf-8');
        console.log(chalk_1.default.green('\n✅ ai.properties.md created successfully!'));
        console.log(chalk_1.default.blue('\n📝 Configuration summary:'));
        console.log(chalk_1.default.gray(`  Base path: ${baseAnswers.basePath}`));
        console.log(chalk_1.default.gray(`  Auto-clone: ${baseAnswers.autoClone ? 'enabled' : 'disabled'}`));
        console.log(chalk_1.default.gray(`  Task manager: ${taskAnswers.taskManager}`));
        console.log(chalk_1.default.gray(`  Repositories: ${manifest.repositories.length}`));
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray('  1. Review and edit ai.properties.md to add repository commands'));
        console.log(chalk_1.default.gray(`  2. Repositories will be auto-cloned to: ${baseAnswers.basePath}/{repo-id}/`));
        console.log(chalk_1.default.gray('  3. This file is gitignored - each developer should run this command'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error setting up configuration:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=config-setup.js.map