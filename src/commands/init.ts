import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

interface InitAnswers {
  orchestratorRepo: string;
  aiProvider: 'claude' | 'cursor' | 'custom';
  customCommandsDir?: string;
}

export async function initCommand() {
  console.log(chalk.blue.bold('\n🚀 Initializing Context-First in this project\n'));

  try {
    // Check if already initialized
    const configPath = path.join(process.cwd(), '.contextrc.json');
    const exists = await fs.access(configPath).then(() => true).catch(() => false);

    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Configuration file already exists. Overwrite?',
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('✋ Initialization cancelled'));
        return;
      }
    }

    // Prompt for configuration
    const answers = await inquirer.prompt<InitAnswers>([
      {
        type: 'input',
        name: 'orchestratorRepo',
        message: 'Git URL of your Orchestrator repository:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Orchestrator repository URL is required';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'aiProvider',
        message: 'Which AI provider will you use?',
        choices: [
          { name: 'Claude', value: 'claude' },
          { name: 'Cursor', value: 'cursor' },
          { name: 'Custom', value: 'custom' },
        ],
        default: 'claude',
      },
      {
        type: 'input',
        name: 'customCommandsDir',
        message: 'Custom commands directory path:',
        when: (answers) => answers.aiProvider === 'custom',
        default: '.ai/commands',
      },
    ]);

    // Determine commands directory based on AI provider
    let commandsDir: string;
    if (answers.aiProvider === 'custom' && answers.customCommandsDir) {
      commandsDir = answers.customCommandsDir;
    } else {
      commandsDir = `.${answers.aiProvider}/commands`;
    }

    // Create configuration object
    const config = {
      orchestratorRepo: answers.orchestratorRepo,
      aiProvider: answers.aiProvider,
      commandsDir: commandsDir,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    };

    // Write configuration file
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');

    console.log(chalk.green('\n✅ Configuration saved to .contextrc.json'));
    console.log(chalk.gray('\nConfiguration:'));
    console.log(chalk.gray(`  Orchestrator: ${config.orchestratorRepo}`));
    console.log(chalk.gray(`  AI Provider: ${config.aiProvider}`));
    console.log(chalk.gray(`  Commands Directory: ${config.commandsDir}`));

    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray('  1. Run "context-cli link" to create command delegation files'));
    console.log(chalk.gray('  2. Run "context-cli feature:start <issue-id>" to begin working on a feature'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error during initialization:'), error);
    process.exit(1);
  }
}
