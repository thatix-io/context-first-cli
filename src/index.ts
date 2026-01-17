#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { scaffoldOrchestratorCommand } from './commands/scaffold-orchestrator';
import { featureCommands } from './commands/feature';

const program = new Command();

program
  .name('context-cli')
  .description('A CLI to manage the Context-First development methodology across any project')
  .version('1.0.0');

// Setup commands
program
  .command('init')
  .description('Initialize Context-First in an existing project')
  .action(initCommand);

program
  .command('scaffold:orchestrator')
  .description('Create a new orchestrator repository from a template')
  .action(scaffoldOrchestratorCommand);

// Feature management commands
const feature = program.command('feature').description('Manage feature workspaces');

feature
  .command('start <issue-id>')
  .description('Create a new feature workspace')
  .option('-r, --repos <repos>', 'Comma-separated list of repositories to include')
  .action(featureCommands.start);

feature
  .command('list')
  .description('List all active feature workspaces')
  .action(featureCommands.list);

feature
  .command('switch <issue-id>')
  .description('Switch to an existing feature workspace')
  .action(featureCommands.switch);

feature
  .command('end <issue-id>')
  .description('Archive and clean up a completed feature workspace')
  .action(featureCommands.end);

// Process commands (to be implemented)
program
  .command('collect <message>')
  .description('Collect a new idea or bug')
  .action((message: string) => {
    console.log(chalk.yellow('🚧 Command "collect" is not yet implemented'));
    console.log(chalk.gray(`Message: ${message}`));
  });

program
  .command('spec')
  .description('Generate specification (PRD) for the current feature')
  .action(() => {
    console.log(chalk.yellow('🚧 Command "spec" is not yet implemented'));
  });

program
  .command('work <message>')
  .description('Record a unit of work and commit')
  .action((message: string) => {
    console.log(chalk.yellow('🚧 Command "work" is not yet implemented'));
    console.log(chalk.gray(`Message: ${message}`));
  });

program
  .command('pr')
  .description('Create Pull Requests for the current feature')
  .action(() => {
    console.log(chalk.yellow('🚧 Command "pr" is not yet implemented'));
  });

// Diagnostic commands
program
  .command('doctor')
  .description('Check environment and configuration')
  .action(() => {
    console.log(chalk.yellow('🚧 Command "doctor" is not yet implemented'));
  });

program
  .command('status')
  .description('Show detailed status of the current workspace')
  .action(() => {
    console.log(chalk.yellow('🚧 Command "status" is not yet implemented'));
  });

program.parse(process.argv);
