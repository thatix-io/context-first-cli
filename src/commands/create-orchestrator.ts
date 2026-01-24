import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { simpleGit } from 'simple-git';

interface ScaffoldAnswers {
  projectName: string;
  description: string;
  metaspecsUrl: string;
  aiProvider: 'claude' | 'cursor' | 'windsurf' | 'other';
  taskManager: 'jira' | 'linear' | 'github' | 'azure' | 'none';
  language: 'en' | 'es' | 'pt-BR';
  initGit: boolean;
}

export async function createOrchestratorCommand() {
  console.log(chalk.blue.bold('\n🏗️  Creating a new Orchestrator repository\n'));

  try {
    const answers = await inquirer.prompt<ScaffoldAnswers>([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name (will be used as directory name):',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
            return 'Project name must contain only letters, numbers, hyphens, and underscores';
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
        validate: (input: string) => {
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

    const targetDir = path.join(process.cwd(), answers.projectName);

    // Check if directory already exists
    const exists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (exists) {
      console.log(chalk.red(`\n❌ Directory "${answers.projectName}" already exists`));
      return;
    }

    // Create directory structure
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetDir, '.claude', 'commands', 'products'), { recursive: true });
    await fs.mkdir(path.join(targetDir, '.claude', 'commands', 'engineer'), { recursive: true });
    await fs.mkdir(path.join(targetDir, '.claude', 'commands', 'quality'), { recursive: true });
    await fs.mkdir(path.join(targetDir, '.sessions'), { recursive: true });

    // Create README.md
    const readme = generateReadme(answers);
    await fs.writeFile(path.join(targetDir, 'README.md'), readme, 'utf-8');

    // Create ai.properties.md template
    const aiProperties = generateAiProperties(answers);
    await fs.writeFile(path.join(targetDir, 'ai.properties.md'), aiProperties, 'utf-8');

    // Create context-manifest.json (empty repositories)
    const manifest = generateManifest(answers);
    await fs.writeFile(path.join(targetDir, 'context-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    // Create context-manifest-example.json (with example repositories)
    const manifestExample = generateManifestExample(answers);
    await fs.writeFile(path.join(targetDir, 'context-manifest-example.json'), JSON.stringify(manifestExample, null, 2), 'utf-8');

    // Copy command templates
    await copyCommandTemplates(targetDir, answers.aiProvider, answers.language);

    // Create .contextrc.json pointing to itself
    const contextrc = {
      orchestratorRepo: `file://${path.resolve(targetDir)}`,
      aiProvider: 'claude',
      commandsDir: '.claude/commands'
    };
    await fs.writeFile(
      path.join(targetDir, '.contextrc.json'),
      JSON.stringify(contextrc, null, 2),
      'utf-8'
    );

    // Create .gitignore
    const gitignore = `node_modules/
.env
.ia.env
ai.properties.md
.sessions/*/
*.log
`;
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore, 'utf-8');

    console.log(chalk.green(`\n✅ Orchestrator created successfully at: ${targetDir}`));
    console.log(chalk.blue('\n📁 Structure created:'));
    const commandsFolder = answers.aiProvider === 'other' ? '.ai' : `.${answers.aiProvider}`;
    console.log(chalk.gray(`  ${commandsFolder}/commands/        - Command definitions for AI`));
    console.log(chalk.gray('  .sessions/               - Feature session data'));
    console.log(chalk.gray('  .contextrc.json          - CLI configuration'));
    console.log(chalk.gray('  ai.properties.md         - Configuration template (gitignored)'));
    console.log(chalk.gray('  context-manifest.json    - Repository manifest (empty)'));
    console.log(chalk.gray('  context-manifest-example.json - Repository manifest example'));

    // Initialize Git if requested
    if (answers.initGit) {
      console.log(chalk.blue('\n🔧 Initializing Git repository...'));
      const git = simpleGit(targetDir);
      await git.init();
      await git.add('.');
      await git.commit('chore: initial commit - orchestrator created by context-cli');
      console.log(chalk.green('✅ Git repository initialized and initial commit created'));
    }

    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray(`  1. cd ${answers.projectName}`));
    console.log(chalk.gray('  2. Run "context-cli config:setup" to configure ai.properties.md'));
    console.log(chalk.gray('  3. Run "context-cli add:repo" to add your code repositories'));
    console.log(chalk.gray('  4. Run "context-cli feature start <issue-id>" to begin working'));
    if (answers.initGit) {
      console.log(chalk.gray('  4. Add remote: git remote add origin <your-repo-url>'));
      console.log(chalk.gray('  5. Push to remote: git push -u origin main'));
    } else {
      console.log(chalk.gray('  4. Initialize as a Git repository and push to remote'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error during creation:'), error);
    process.exit(1);
  }
}

async function copyCommandTemplates(targetDir: string, aiProvider: string, language: string = 'en'): Promise<void> {
  // Use language-specific templates
  const templatesDir = path.join(__dirname, '..', '..', 'templates', 'commands', language);
  
  // Determine target directory based on AI provider
  const commandsFolder = aiProvider === 'other' ? '.ai' : `.${aiProvider}`;
  const targetCommandsDir = path.join(targetDir, commandsFolder, 'commands');

  // Copy warm-up.md
  await fs.copyFile(
    path.join(templatesDir, 'warm-up.md'),
    path.join(targetCommandsDir, 'warm-up.md')
  );

  // Copy products commands
  const productsCommands = ['collect.md', 'refine.md', 'spec.md', 'check.md'];
  for (const cmd of productsCommands) {
    await fs.copyFile(
      path.join(templatesDir, 'products', cmd),
      path.join(targetCommandsDir, 'products', cmd)
    );
  }

  // Copy engineer commands
  const engineerCommands = ['start.md', 'plan.md', 'work.md', 'pre-pr.md', 'pr.md'];
  for (const cmd of engineerCommands) {
    await fs.copyFile(
      path.join(templatesDir, 'engineer', cmd),
      path.join(targetCommandsDir, 'engineer', cmd)
    );
  }

  // Copy quality commands
  const qualityCommands = ['observe.md', 'metrics.md'];
  for (const cmd of qualityCommands) {
    await fs.copyFile(
      path.join(templatesDir, 'quality', cmd),
      path.join(targetCommandsDir, 'quality', cmd)
    );
  }
}

function generateReadme(answers: ScaffoldAnswers): string {
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

function generateAiProperties(answers: ScaffoldAnswers): string {
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

function generateManifest(answers: ScaffoldAnswers) {
  return {
    version: '1.0',
    project: answers.projectName,
    description: answers.description,
    repositories: [],
  };
}

function generateManifestExample(answers: ScaffoldAnswers) {
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
