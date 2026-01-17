import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface Repository {
  id: string;
  role: string;
  url: string;
  dependsOn?: string[];
  description: string;
}

interface ContextManifest {
  version: string;
  project: string;
  description: string;
  repositories: Repository[];
}

export async function configSetupCommand() {
  console.log(chalk.blue.bold('\n⚙️  Setting up ai.properties.md configuration\n'));

  try {
    // Check if we're in an orchestrator directory
    const manifestPath = path.join(process.cwd(), 'context-manifest.json');
    const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);
    
    if (!manifestExists) {
      console.log(chalk.red('\n❌ context-manifest.json not found'));
      console.log(chalk.gray('This command must be run from an orchestrator repository root'));
      console.log(chalk.gray('Hint: Run this after creating an orchestrator with create:orchestrator'));
      return;
    }

    // Read manifest to get repository list
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest: ContextManifest = JSON.parse(manifestContent);

    console.log(chalk.gray(`Found ${manifest.repositories.length} repositories in manifest\n`));

    // Check if ai.properties.md already exists
    const propsPath = path.join(process.cwd(), 'ai.properties.md');
    const propsExists = await fs.access(propsPath).then(() => true).catch(() => false);

    if (propsExists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'ai.properties.md already exists. Do you want to overwrite it?',
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray('\nOperation cancelled'));
        return;
      }
    }

    // Get base workspace path
    const defaultBasePath = path.join(os.homedir(), 'workspace');
    
    const baseAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'basePath',
        message: 'Base workspace path (where repositories will be cloned):',
        default: defaultBasePath,
        validate: (input: string) => {
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
    console.log(chalk.blue('\n🎯 Task Manager Configuration:\n'));
    
    const taskAnswers = await inquirer.prompt([
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
    } else if (taskAnswers.taskManager === 'linear') {
      content += `linear_team=${taskAnswers.linearTeam}\n`;
    } else if (taskAnswers.taskManager === 'github') {
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
    await fs.writeFile(propsPath, content, 'utf-8');

    console.log(chalk.green('\n✅ ai.properties.md created successfully!'));
    console.log(chalk.blue('\n📝 Configuration summary:'));
    console.log(chalk.gray(`  Base path: ${baseAnswers.basePath}`));
    console.log(chalk.gray(`  Auto-clone: ${baseAnswers.autoClone ? 'enabled' : 'disabled'}`));
    console.log(chalk.gray(`  Task manager: ${taskAnswers.taskManager}`));
    console.log(chalk.gray(`  Repositories: ${manifest.repositories.length}`));
    
    console.log(chalk.blue('\n💡 Next steps:'));
    console.log(chalk.gray('  1. Review and edit ai.properties.md to add repository commands'));
    console.log(chalk.gray(`  2. Repositories will be auto-cloned to: ${baseAnswers.basePath}/{repo-id}/`));
    console.log(chalk.gray('  3. This file is gitignored - each developer should run this command'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error setting up configuration:'), error);
    process.exit(1);
  }
}
