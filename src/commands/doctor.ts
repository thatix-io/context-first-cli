import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import {
  findConfig,
  loadManifest,
  pathExists,
} from '../utils/config';
import { isGitRepo } from '../utils/git';

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

export async function doctorCommand() {
  console.log(chalk.blue.bold('\n🏥 Running environment diagnostics...\n'));

  const results: CheckResult[] = [];

  // Check 1: Git installation
  results.push(await checkGit());

  // Check 2: Node.js version
  results.push(await checkNode());

  // Check 3: Configuration file
  results.push(await checkConfiguration());

  // Check 4: Orchestrator repository
  const orchestratorCheck = await checkOrchestrator();
  if (orchestratorCheck) {
    results.push(orchestratorCheck);
  }

  // Check 5: Main repositories
  const reposCheck = await checkMainRepositories();
  if (reposCheck) {
    results.push(reposCheck);
  }

  // Check 6: Workspaces directory
  results.push(await checkWorkspacesDirectory());

  // Display results
  console.log(chalk.bold('\n📊 Diagnostic Results:\n'));

  for (const result of results) {
    const icon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗';
    const color = result.status === 'pass' ? chalk.green : result.status === 'warn' ? chalk.yellow : chalk.red;
    
    console.log(color(`${icon} ${result.name}`));
    console.log(chalk.gray(`  ${result.message}`));
  }

  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const warned = results.filter(r => r.status === 'warn').length;
  const failed = results.filter(r => r.status === 'fail').length;

  console.log(chalk.bold('\n📈 Summary:'));
  console.log(chalk.green(`  ✓ Passed: ${passed}`));
  if (warned > 0) console.log(chalk.yellow(`  ⚠ Warnings: ${warned}`));
  if (failed > 0) console.log(chalk.red(`  ✗ Failed: ${failed}`));

  if (failed > 0) {
    console.log(chalk.red('\n❌ Some checks failed. Please address the issues above.'));
    process.exit(1);
  } else if (warned > 0) {
    console.log(chalk.yellow('\n⚠️  Some checks have warnings. Review them if needed.'));
  } else {
    console.log(chalk.green('\n✅ All checks passed! Your environment is ready.'));
  }
}

async function checkGit(): Promise<CheckResult> {
  try {
    const version = execSync('git --version', { encoding: 'utf-8' }).trim();
    return {
      name: 'Git Installation',
      status: 'pass',
      message: version,
    };
  } catch (error) {
    return {
      name: 'Git Installation',
      status: 'fail',
      message: 'Git is not installed or not in PATH',
    };
  }
}

async function checkNode(): Promise<CheckResult> {
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    
    if (major >= 18) {
      return {
        name: 'Node.js Version',
        status: 'pass',
        message: `Node.js ${version} (recommended: >= 18)`,
      };
    } else {
      return {
        name: 'Node.js Version',
        status: 'warn',
        message: `Node.js ${version} (recommended: >= 18)`,
      };
    }
  } catch (error) {
    return {
      name: 'Node.js Version',
      status: 'fail',
      message: 'Could not determine Node.js version',
    };
  }
}

async function checkConfiguration(): Promise<CheckResult> {
  const configResult = await findConfig();
  
  if (!configResult) {
    return {
      name: 'Configuration File',
      status: 'fail',
      message: 'No .contextrc.json found. Run "context-cli init" to create one.',
    };
  }

  const { config, configDir } = configResult;
  return {
    name: 'Configuration File',
    status: 'pass',
    message: `Found at ${configDir} (AI Provider: ${config.aiProvider})`,
  };
}

async function checkOrchestrator(): Promise<CheckResult | null> {
  const configResult = await findConfig();
  if (!configResult) return null;

  const { config, configDir } = configResult;
  const orchestratorPath = path.join(configDir, '.context-orchestrator');

  if (!(await pathExists(orchestratorPath))) {
    return {
      name: 'Orchestrator Repository',
      status: 'warn',
      message: 'Not cloned yet. Will be cloned on first "feature:start".',
    };
  }

  const isRepo = await isGitRepo(orchestratorPath);
  if (!isRepo) {
    return {
      name: 'Orchestrator Repository',
      status: 'fail',
      message: `Directory exists at ${orchestratorPath} but is not a valid Git repository`,
    };
  }

  const manifest = await loadManifest(orchestratorPath);
  if (!manifest) {
    return {
      name: 'Orchestrator Repository',
      status: 'warn',
      message: 'Cloned but context-manifest.json not found or invalid',
    };
  }

  return {
    name: 'Orchestrator Repository',
    status: 'pass',
    message: `Cloned and valid (Project: ${manifest.project}, ${manifest.repositories.length} repos defined)`,
  };
}

async function checkMainRepositories(): Promise<CheckResult | null> {
  const configResult = await findConfig();
  if (!configResult) return null;

  const { configDir } = configResult;
  const mainReposDir = path.join(configDir, '.context-repos');

  if (!(await pathExists(mainReposDir))) {
    return {
      name: 'Main Repositories',
      status: 'warn',
      message: 'No main repositories cloned yet. Will be cloned on first "feature:start".',
    };
  }

  const orchestratorPath = path.join(configDir, '.context-orchestrator');
  const manifest = await loadManifest(orchestratorPath);
  
  if (!manifest) {
    return null;
  }

  const fs = await import('fs/promises');
  const entries = await fs.readdir(mainReposDir, { withFileTypes: true });
  const clonedRepos = entries.filter(e => e.isDirectory()).map(e => e.name);

  const clonedCount = clonedRepos.length;
  const totalCount = manifest.repositories.length;

  if (clonedCount === 0) {
    return {
      name: 'Main Repositories',
      status: 'warn',
      message: 'No repositories cloned yet',
    };
  } else if (clonedCount < totalCount) {
    return {
      name: 'Main Repositories',
      status: 'pass',
      message: `${clonedCount}/${totalCount} repositories cloned`,
    };
  } else {
    return {
      name: 'Main Repositories',
      status: 'pass',
      message: `All ${totalCount} repositories cloned`,
    };
  }
}

async function checkWorkspacesDirectory(): Promise<CheckResult> {
  const configResult = await findConfig();
  if (!configResult) {
    return {
      name: 'Workspaces Directory',
      status: 'warn',
      message: 'No configuration found',
    };
  }

  const { configDir } = configResult;
  const orchestratorPath = path.join(configDir, '.context-orchestrator');
  const sessionsDir = path.join(orchestratorPath, '.sessions');

  if (!(await pathExists(sessionsDir))) {
    return {
      name: 'Workspaces Directory',
      status: 'warn',
      message: `No workspaces created yet (${sessionsDir})`,
    };
  }

  const fs = await import('fs/promises');
  const entries = await fs.readdir(sessionsDir, { withFileTypes: true });
  const workspaceCount = entries.filter(e => e.isDirectory()).length;

  return {
    name: 'Workspaces Directory',
    status: 'pass',
    message: `${workspaceCount} workspace(s) found at ${sessionsDir}`,
  };
}
