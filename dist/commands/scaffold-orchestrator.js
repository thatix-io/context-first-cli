"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldOrchestratorCommand = scaffoldOrchestratorCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function scaffoldOrchestratorCommand() {
    console.log(chalk_1.default.blue.bold('\n🏗️  Scaffolding a new Orchestrator repository\n'));
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
                type: 'list',
                name: 'taskManager',
                message: 'Which task management system will you use?',
                choices: [
                    { name: 'Jira', value: 'jira' },
                    { name: 'Linear', value: 'linear' },
                    { name: 'GitHub Issues', value: 'github' },
                    { name: 'None (manual)', value: 'none' },
                ],
                default: 'jira',
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
        await promises_1.default.mkdir(path_1.default.join(targetDir, 'commands', 'definitions', 'product'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, 'commands', 'definitions', 'engineer'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, 'commands', 'definitions', 'feature'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, 'scripts', 'worktree'), { recursive: true });
        await promises_1.default.mkdir(path_1.default.join(targetDir, 'sessions'), { recursive: true });
        // Create README.md
        const readme = generateReadme(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'README.md'), readme, 'utf-8');
        // Create ai.properties.md template
        const aiProperties = generateAiProperties(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'ai.properties.md'), aiProperties, 'utf-8');
        // Create context-manifest.json
        const manifest = generateManifest(answers);
        await promises_1.default.writeFile(path_1.default.join(targetDir, 'context-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
        // Create .gitignore
        const gitignore = `node_modules/\n.env\n.ia.env\nsessions/*/\n*.log\n`;
        await promises_1.default.writeFile(path_1.default.join(targetDir, '.gitignore'), gitignore, 'utf-8');
        console.log(chalk_1.default.green(`\n✅ Orchestrator scaffolded successfully at: ${targetDir}`));
        console.log(chalk_1.default.blue('\n📁 Structure created:'));
        console.log(chalk_1.default.gray('  commands/definitions/    - Command definitions for AI'));
        console.log(chalk_1.default.gray('  scripts/worktree/        - Worktree management scripts'));
        console.log(chalk_1.default.gray('  sessions/                - Feature session data'));
        console.log(chalk_1.default.gray('  ai.properties.md         - Configuration template'));
        console.log(chalk_1.default.gray('  context-manifest.json    - Repository manifest'));
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray(`  1. cd ${answers.projectName}`));
        console.log(chalk_1.default.gray('  2. Edit ai.properties.md with your project paths'));
        console.log(chalk_1.default.gray('  3. Edit context-manifest.json to define your repositories'));
        console.log(chalk_1.default.gray('  4. Initialize as a Git repository and push to remote'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error during scaffolding:'), error);
        process.exit(1);
    }
}
function generateReadme(answers) {
    return `# ${answers.projectName}

${answers.description}

## 📚 Documentation

This orchestrator manages the Context-First development methodology for the project.

## 🏗️ Structure

\`\`\`
${answers.projectName}/
├── commands/
│   └── definitions/          # Command definitions for AI
│       ├── product/         # Product commands
│       ├── engineer/        # Engineering commands
│       └── feature/         # Feature management commands
├── scripts/
│   └── worktree/            # Worktree management scripts
├── sessions/                # Feature session data
├── ai.properties.md         # Configuration
└── context-manifest.json    # Repository manifest
\`\`\`

## ⚙️ Configuration

Edit \`ai.properties.md\` to configure:
- Project paths
- Task manager credentials (${answers.taskManager})
- Branch conventions
- Repository-specific commands

## 🚀 Usage

1. Configure \`ai.properties.md\` with your project paths
2. Define your repositories in \`context-manifest.json\`
3. Use \`context-cli\` to manage features and workspaces

## 📝 License

MIT
`;
}
function generateAiProperties(answers) {
    return `# ${answers.projectName} - Orchestrator Configuration

## Paths dos Projetos
base_path=/path/to/your/workspace
meta_specs_path=/path/to/your/meta-specs
backend_path=/path/to/your/backend
frontend_path=/path/to/your/frontend

## Configuração ${answers.taskManager === 'jira' ? 'Jira' : answers.taskManager === 'linear' ? 'Linear' : 'Task Manager'}
task_management_system=${answers.taskManager}
${answers.taskManager === 'jira' ? `jira_site=https://your-org.atlassian.net
jira_cloud_id=your-cloud-id
jira_project_key=PROJ
jira_project_id=10000` : ''}
${answers.taskManager === 'linear' ? `linear_api_key=your-api-key
linear_team_id=your-team-id` : ''}
${answers.taskManager === 'github' ? `github_org=your-org
github_repo=your-repo` : ''}

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
        repositories: [
            {
                id: 'metaspecs',
                role: 'specs-provider',
                url: 'git@github.com:your-org/your-metaspecs.git',
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
//# sourceMappingURL=scaffold-orchestrator.js.map