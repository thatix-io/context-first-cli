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
  mainBranch?: string;
}

interface ContextManifest {
  version: string;
  project: string;
  description: string;
  repositories: Repository[];
}

export async function setRepoBranchCommand(repoId?: string) {
  console.log(chalk.blue.bold('\n🌿 Update main branch for a repository\n'));

  try {
    const manifestPath = path.join(process.cwd(), 'context-manifest.json');
    const exists = await fs.access(manifestPath).then(() => true).catch(() => false);

    if (!exists) {
      console.log(chalk.red('\n❌ context-manifest.json not found in current directory'));
      console.log(chalk.gray('Make sure you are in an orchestrator repository root'));
      return;
    }

    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest: ContextManifest = JSON.parse(manifestContent);

    if (manifest.repositories.length === 0) {
      console.log(chalk.yellow('\n⚠️  No repositories found in context-manifest.json'));
      return;
    }

    let targetRepoId = repoId;

    if (!targetRepoId) {
      const { selectedRepo } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedRepo',
          message: 'Select the repository to update:',
          choices: manifest.repositories.map(r => ({
            name: `${r.id} (current: ${r.mainBranch || 'main'})`,
            value: r.id,
          })),
        },
      ]);
      targetRepoId = selectedRepo;
    }

    const repoIndex = manifest.repositories.findIndex(r => r.id === targetRepoId);

    if (repoIndex === -1) {
      console.log(chalk.red(`\n❌ Repository "${targetRepoId}" not found in context-manifest.json`));
      return;
    }

    const currentBranch = manifest.repositories[repoIndex].mainBranch || 'main';

    const { newBranch } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newBranch',
        message: `New main branch for "${targetRepoId}":`,
        default: currentBranch,
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Branch name is required';
          }
          return true;
        },
      },
    ]);

    manifest.repositories[repoIndex].mainBranch = newBranch;

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    console.log(chalk.green(`\n✅ Main branch for "${targetRepoId}" updated to "${newBranch}"`));

  } catch (error) {
    console.error(chalk.red('\n❌ Error updating repository branch:'), error);
    process.exit(1);
  }
}
