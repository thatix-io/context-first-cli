import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { simpleGit } from 'simple-git';

interface ScaffoldAnswers {
  projectName: string;
  description: string;
  taskManager: 'jira' | 'linear' | 'github' | 'none';
  initGit: boolean;
}

export async function scaffoldOrchestratorCommand() {
  console.log(chalk.blue.bold('\n🏗️  Scaffolding a new Orchestrator repository\n'));

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

    // Create context-manifest.json
    const manifest = generateManifest(answers);
    await fs.writeFile(path.join(targetDir, 'context-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    // Copy command templates
    await copyCommandTemplates(targetDir);

    // Create .gitignore
    const gitignore = `node_modules/
.env
.ia.env
ai.properties.md
.sessions/*/
*.log
`;
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore, 'utf-8');

    console.log(chalk.green(`\n✅ Orchestrator scaffolded successfully at: ${targetDir}`));
    console.log(chalk.blue('\n📁 Structure created:'));
    console.log(chalk.gray('  .claude/commands/        - Command definitions for AI'));
    console.log(chalk.gray('  .sessions/               - Feature session data'));
    console.log(chalk.gray('  ai.properties.md         - Configuration template (gitignored)'));
    console.log(chalk.gray('  context-manifest.json    - Repository manifest'));

    // Initialize Git if requested
    if (answers.initGit) {
      console.log(chalk.blue('\n🔧 Initializing Git repository...'));
      const git = simpleGit(targetDir);
      await git.init();
      await git.add('.');
      await git.commit('chore: initial commit - orchestrator scaffolded by context-cli');
      console.log(chalk.green('✅ Git repository initialized and initial commit created'));
    }

    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray(`  1. cd ${answers.projectName}`));
    console.log(chalk.gray('  2. Edit ai.properties.md with your project paths'));
    console.log(chalk.gray('  3. Edit context-manifest.json to define your repositories'));
    if (answers.initGit) {
      console.log(chalk.gray('  4. Add remote: git remote add origin <your-repo-url>'));
      console.log(chalk.gray('  5. Push to remote: git push -u origin main'));
    } else {
      console.log(chalk.gray('  4. Initialize as a Git repository and push to remote'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error during scaffolding:'), error);
    process.exit(1);
  }
}

async function copyCommandTemplates(targetDir: string): Promise<void> {
  const templatesDir = path.join(__dirname, '..', '..', 'templates', 'commands');
  const targetCommandsDir = path.join(targetDir, '.claude', 'commands');

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
  return `# ${answers.projectName}

${answers.description}

## 📚 Documentation

This orchestrator manages the Context-First development methodology for the project.

## 🏗️ Structure

\`\`\`
${answers.projectName}/
├── .claude/
│   └── commands/            # Command definitions for AI
│       ├── products/        # Product commands (collect, refine, spec, check)
│       ├── engineer/        # Engineering commands (start, plan, work, pre-pr, pr)
│       ├── quality/         # Quality commands (observe, metrics)
│       └── warm-up.md       # Context loading command
├── .sessions/               # Feature session data (gitignored)
├── ai.properties.md         # Configuration (gitignored - each dev has their own)
└── context-manifest.json    # Repository manifest
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
2. Define your repositories in \`context-manifest.json\`
3. Use \`context-cli\` to manage features and workspaces

## 📝 License

MIT
`;
}

function generateAiProperties(answers: ScaffoldAnswers): string {
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

function generateManifest(answers: ScaffoldAnswers) {
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
