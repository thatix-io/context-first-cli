import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

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

export async function addRepoCommand() {
  console.log(chalk.blue.bold('\n📦 Adding a new repository to context-manifest.json\n'));

  try {
    // Check if context-manifest.json exists
    const manifestPath = path.join(process.cwd(), 'context-manifest.json');
    const exists = await fs.access(manifestPath).then(() => true).catch(() => false);
    
    if (!exists) {
      console.log(chalk.red('\n❌ context-manifest.json not found in current directory'));
      console.log(chalk.gray('Make sure you are in an orchestrator repository root'));
      return;
    }

    // Read existing manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest: ContextManifest = JSON.parse(manifestContent);

    // Get repository IDs for dependencies
    const existingRepoIds = manifest.repositories.map(r => r.id);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Repository ID (unique identifier):',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Repository ID is required';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Repository ID must contain only lowercase letters, numbers, and hyphens';
          }
          if (existingRepoIds.includes(input)) {
            return `Repository ID "${input}" already exists`;
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'url',
        message: 'Repository URL (Git):',
        validate: (input: string) => {
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
        validate: (input: string) => {
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

    // Create new repository entry
    const newRepo: Repository = {
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
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    console.log(chalk.green(`\n✅ Repository "${answers.id}" added successfully!`));
    console.log(chalk.blue('\n📝 Repository details:'));
    console.log(chalk.gray(`  ID: ${answers.id}`));
    console.log(chalk.gray(`  Role: ${answers.role}`));
    console.log(chalk.gray(`  URL: ${answers.url}`));
    if (newRepo.dependsOn && newRepo.dependsOn.length > 0) {
      console.log(chalk.gray(`  Dependencies: ${newRepo.dependsOn.join(', ')}`));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error adding repository:'), error);
    process.exit(1);
  }
}
