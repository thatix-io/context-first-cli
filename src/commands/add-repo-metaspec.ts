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

export async function addRepoMetaspecCommand() {
  console.log(chalk.blue.bold('\n📚 Adding MetaSpecs repository to context-manifest.json\n'));

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

    // Check if metaspecs already exists
    const metaspecsExists = manifest.repositories.some(r => r.role === 'specs-provider' || r.id === 'metaspecs');
    
    if (metaspecsExists) {
      console.log(chalk.yellow('\n⚠️  A MetaSpecs repository already exists in the manifest'));
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to replace it?',
          default: false,
        },
      ]);

      if (!proceed) {
        console.log(chalk.gray('\nOperation cancelled'));
        return;
      }

      // Remove existing metaspecs
      manifest.repositories = manifest.repositories.filter(r => r.role !== 'specs-provider' && r.id !== 'metaspecs');
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'MetaSpecs repository URL (Git):',
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
        default: 'MetaSpecs repository with technical and business specifications',
      },
    ]);

    // Create metaspecs repository entry
    const metaspecsRepo: Repository = {
      id: 'metaspecs',
      role: 'specs-provider',
      url: answers.url,
      description: answers.description,
    };

    // Add to beginning of repositories array (metaspecs should be first)
    manifest.repositories.unshift(metaspecsRepo);

    // Write back to file
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    console.log(chalk.green('\n✅ MetaSpecs repository added successfully!'));
    console.log(chalk.blue('\n📝 Repository details:'));
    console.log(chalk.gray(`  ID: metaspecs`));
    console.log(chalk.gray(`  Role: specs-provider`));
    console.log(chalk.gray(`  URL: ${answers.url}`));
    console.log(chalk.gray(`  Description: ${answers.description}`));

    console.log(chalk.blue('\n💡 Next step:'));
    console.log(chalk.gray('  Update ai.properties.md with the local path to your cloned MetaSpecs repository'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error adding MetaSpecs repository:'), error);
    process.exit(1);
  }
}
