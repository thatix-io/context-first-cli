"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrchestratorCommand = createOrchestratorCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = require("simple-git");
async function createOrchestratorCommand() {
    console.log(chalk_1.default.blue.bold('\n🏗️  Creating a new Orchestrator repository\n'));
    try {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name (will be used as directory name):',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Project name is required';
                    }
                    if (!/^[a-z0-9-]+$/.test(input)) {
                        return 'Project name must contain only lowercase letters, numbers, and hyphens';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description:',
                default: 'Orchestrator for Context-First development',
            },
            {
                type: 'input',
                name: 'metaspecsUrl',
                message: 'MetaSpecs repository URL (Git):',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'MetaSpecs repository URL is required';
                    }
                    if (!input.includes('git') && !input.includes('.git')) {
                        return 'Please provide a valid Git repository URL';
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'aiProvider',
                message: 'Which AI provider will you use?',
                choices: [
                    { name: 'Claude (Anthropic)', value: 'claude' },
                    { name: 'Cursor', value: 'cursor' },
                    { name: 'Windsurf (Codeium)', value: 'windsurf' },
                    { name: 'Other / Custom', value: 'other' },
                ],
                default: 'claude',
            },
            {
                type: 'list',
                name: 'taskManager',
                message: 'Which task management system will you use?',
                choices: [
                    { name: 'Jira', value: 'jira' },
                    { name: 'Linear', value: 'linear' },
                    { name: 'GitHub Issues', value: 'github' },
                    { name: 'Azure Boards', value: 'azure' },
                    { name: 'None (manual)', value: 'none' },
                ],
                default: 'jira',
            },
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
            {
                type: 'confirm',
                name: 'initGit',
                message: 'Initialize Git repository and create initial commit?',
                default: true,
            },
        ]);
        const targetDir = path_1.default.join(process.cwd(), answers.projectName);
        // Check if directory already exists
        const exists = await promises_1.default.access(targetDir).then(() => true).catch(() => false);
        if (exists) {
            console.log(chalk_1.default.red(`\n❌ Directory "${answers.projectName}" already exists`));
            return;
        }
        // Create directory structure
        await promises_1.default.mkdir(targetDir, { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, '.claude', 'commands', 'products'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, '.claude', 'commands', 'engineer'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, '.claude', 'commands', 'quality'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, '.sessions'), { recursive: true });
        // Create README.md
        const readme = generateReadme(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'README.md'), readme, 'utf-8');
        // Create ai.properties.md template
        const aiProperties = generateAiProperties(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'ai.properties.md'), aiProperties, 'utf-8');
        // Create context-manifest.json (empty repositories)
        const manifest = generateManifest(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'context-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
        // Create context-manifest-example.json (with example repositories)
        const manifestExample = generateManifestExample(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'context-manifest-example.json'), JSON.stringify(manifestExample, null, 2), 'utf-8');
        // Copy command templates
        await copyCommandTemplates(targetDir, answers.aiProvider, answers.language);
        // Create .contextrc.json pointing to itself
        const contextrc = {
            orchestratorRepo: `file://${path_1.default.resolve(targetDir)}`,
            aiProvider: 'claude',
            commandsDir: '.claude/commands'
        };
        await promises_1.default.writeFile(path_1.default.join(targetDir, '.contextrc.json'), JSON.stringify(contextrc, null, 2), 'utf-8');
        // Create .gitignore
        const gitignore = `node_modules/
.env
.ia.env
ai.properties.md
.sessions/*/
*.log
`;
        await promises_1.default.writeFile(path_1.default.join(targetDir, '.gitignore'), gitignore, 'utf-8');
        console.log(chalk_1.default.green(`\n✅ Orchestrator created successfully at: ${targetDir}`));
        console.log(chalk_1.default.blue('\n📁 Structure created:'));
        const commandsFolder = answers.aiProvider === 'other' ? '.ai' : `.${answers.aiProvider}`;
        console.log(chalk_1.default.gray(`  ${commandsFolder}/commands/        - Command definitions for AI`));
        console.log(chalk_1.default.gray('  .sessions/               - Feature session data'));
        console.log(chalk_1.default.gray('  .contextrc.json          - CLI configuration'));
        console.log(chalk_1.default.gray('  ai.properties.md         - Configuration template (gitignored)'));
        console.log(chalk_1.default.gray('  context-manifest.json    - Repository manifest (empty)'));
        console.log(chalk_1.default.gray('  context-manifest-example.json - Repository manifest example'));
        // Initialize Git if requested
        if (answers.initGit) {
            console.log(chalk_1.default.blue('\n🔧 Initializing Git repository...'));
            const git = (0, simple_git_1.simpleGit)(targetDir);
            await git.init();
            await git.add('.');
            await git.commit('chore: initial commit - orchestrator created by context-cli');
            console.log(chalk_1.default.green('✅ Git repository initialized and initial commit created'));
        }
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray(`  1. cd ${answers.projectName}`));
        console.log(chalk_1.default.gray('  2. Run "context-cli config:setup" to configure ai.properties.md'));
        console.log(chalk_1.default.gray('  3. Run "context-cli add:repo" to add your code repositories'));
        console.log(chalk_1.default.gray('  4. Run "context-cli feature start <issue-id>" to begin working'));
        if (answers.initGit) {
            console.log(chalk_1.default.gray('  4. Add remote: git remote add origin <your-repo-url>'));
            console.log(chalk_1.default.gray('  5. Push to remote: git push -u origin main'));
        }
        else {
            console.log(chalk_1.default.gray('  4. Initialize as a Git repository and push to remote'));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error during creation:'), error);
        process.exit(1);
    }
}
async function copyCommandTemplates(targetDir, aiProvider, language = 'en') {
    // Use language-specific templates
    const templatesDir = path_1.default.join(__dirname, '..', '..', 'templates', 'commands', language);
    // Determine target directory based on AI provider
    const commandsFolder = aiProvider === 'other' ? '.ai' : `.${aiProvider}`;
    const targetCommandsDir = path_1.default.join(targetDir, commandsFolder, 'commands');
    // Copy warm-up.md
    await promises_1.default.copyFile(path_1.default.join(templatesDir, 'warm-up.md'), path_1.default.join(targetCommandsDir, 'warm-up.md'));
    // Copy products commands
    const productsCommands = ['collect.md', 'refine.md', 'spec.md', 'check.md'];
    for (const cmd of productsCommands) {
        await promises_1.default.copyFile(path_1.default.join(templatesDir, 'products', cmd), path_1.default.join(targetCommandsDir, 'products', cmd));
    }
    // Copy engineer commands
    const engineerCommands = ['start.md', 'plan.md', 'work.md', 'pre-pr.md', 'pr.md'];
    for (const cmd of engineerCommands) {
        await promises_1.default.copyFile(path_1.default.join(templatesDir, 'engineer', cmd), path_1.default.join(targetCommandsDir, 'engineer', cmd));
    }
    // Copy quality commands
    const qualityCommands = ['observe.md', 'metrics.md'];
    for (const cmd of qualityCommands) {
        await promises_1.default.copyFile(path_1.default.join(templatesDir, 'quality', cmd), path_1.default.join(targetCommandsDir, 'quality', cmd));
    }
}
function generateReadme(answers) {
    const commandsFolder = answers.aiProvider === 'other' ? '.ai' : `.${answers.aiProvider}`;
    return `# ${answers.projectName}

${answers.description}

## 📚 Documentation

This orchestrator manages the Context-First development methodology for the project.

## 🏭️ Structure

\`\`\`
${answers.projectName}/
├── ${commandsFolder}/
│   └── commands/            # Command definitions for AI
│       ├── products/        # Product commands (collect, refine, spec, check)
│       ├── engineer/        # Engineering commands (start, plan, work, pre-pr, pr)
│       ├── quality/         # Quality commands (observe, metrics)
│       └── warm-up.md       # Context loading command
├── .sessions/               # Feature session data (gitignored)
├── ai.properties.md         # Configuration (gitignored - each dev has their own)
├── context-manifest.json         # Repository manifest (empty - add your repos)
└── context-manifest-example.json # Example manifest with sample repositories
\`\`\`

## ⚙️ Configuration

Edit \`ai.properties.md\` to configure:
- Project paths (specific to each developer)
- Task manager credentials (${answers.taskManager})
- Branch conventions
- Repository-specific commands

**Note**: \`ai.properties.md\` is gitignored because it contains local paths and credentials specific to each developer.

## 🚀 Usage

1. Configure \`ai.properties.md\` with your project paths
2. Define your repositories in \`context-manifest.json\` (see \`context-manifest-example.json\` for reference)
3. Use \`context-cli\` to manage features and workspaces

## 📝 License

MIT
`;
}
function generateAiProperties(answers) {
    return `# ${answers.projectName} - Orchestrator Configuration

## Paths dos Projetos
base_path=/path/to/your/workspace
auto_clone=true

## Configuração ${answers.taskManager === 'jira' ? 'Jira' : answers.taskManager === 'linear' ? 'Linear' : answers.taskManager === 'azure' ? 'Azure Boards' : 'Task Manager'}
task_management_system=${answers.taskManager}
${answers.taskManager === 'jira' ? `jira_site=https://your-org.atlassian.net
jira_cloud_id=your-cloud-id
jira_project_key=PROJ
jira_project_id=10000` : ''}
${answers.taskManager === 'linear' ? `linear_api_key=your-api-key
linear_team_id=your-team-id` : ''}
${answers.taskManager === 'github' ? `github_org=your-org
github_repo=your-repo` : ''}
${answers.taskManager === 'azure' ? `azure_organization=your-org
azure_project=your-project
azure_team=your-team` : ''}

## Convenções de Branch
branch_prefix=feature
branch_pattern=feature/{slug}

## Comandos por Repositório

### Backend
backend.lint_command=npm run lint
backend.test_unit_command=npm run test:unit
backend.test_integration_command=npm run test:integration
backend.build_command=npm run build

### Frontend
frontend.lint_command=npm run lint
frontend.test_unit_command=npm run test:unit
frontend.build_command=npm run build
`;
}
function generateManifest(answers) {
    return {
        version: '1.0',
        project: answers.projectName,
        description: answers.description,
        repositories: [],
    };
}
function generateManifestExample(answers) {
    return {
        version: '1.0',
        project: answers.projectName,
        description: answers.description,
        repositories: [
            {
                id: 'metaspecs',
                role: 'specs-provider',
                url: answers.metaspecsUrl,
                description: 'MetaSpecs repository with technical and business specifications',
            },
            {
                id: 'backend',
                role: 'application',
                url: 'git@github.com:your-org/your-backend.git',
                dependsOn: ['metaspecs'],
                description: 'Backend application',
            },
            {
                id: 'frontend',
                role: 'application',
                url: 'git@github.com:your-org/your-frontend.git',
                dependsOn: ['metaspecs', 'backend'],
                description: 'Frontend application',
            },
        ],
    };
}
//# sourceMappingURL=create-orchestrator.js.map