#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { createOrchestratorCommand } from './commands/create-orchestrator';
import { addRepoCommand } from './commands/add-repo';
import { addRepoMetaspecCommand } from './commands/add-repo-metaspec';
import { configSetupCommand } from './commands/config-setup';
import { updateCommands } from './commands/update-commands';
import { featureCommands } from './commands/feature';
import { doctorCommand } from './commands/doctor';
import { statusCommand } from './commands/status';

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
  .command('create:orchestrator')
  .description('Create a new orchestrator repository from a template')
  .action(createOrchestratorCommand);

program
  .command('add:repo')
  .description('Add a new code repository to context-manifest.json')
  .action(addRepoCommand);

program
  .command('add:repo-metaspec')
  .description('Add or update the MetaSpecs repository in context-manifest.json')
  .action(addRepoMetaspecCommand);

program
  .command('config:setup')
  .description('Interactively configure ai.properties.md for local development')
  .action(configSetupCommand);

program
  .command('update:commands')
  .description('Update command templates in an existing orchestrator')
  .action(updateCommands);

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
  .command('merge <issue-id>')
  .description('Merge feature branch into target branch and clean up workspace')
  .option('-t, --target-branch <branch>', 'Target branch to merge into (default: main)')
  .option('--no-push', 'Do not push changes after merge')
  .option('--keep-workspace', 'Keep workspace after merge')
  .option('-f, --force', 'Force merge without confirmation')
  .action(featureCommands.merge);

feature
  .command('add-repo <issue-id>')
  .description('Add repositories to an existing feature workspace')
  .action(featureCommands['add-repo']);

feature
  .command('end <issue-id>')
  .description('Archive and clean up a completed feature workspace')
  .option('-f, --force', 'Force cleanup without confirmation')
  .action(featureCommands.end);

// Diagnostic commands
program
  .command('doctor')
  .description('Check environment and configuration')
  .action(doctorCommand);

program
  .command('status')
  .description('Show detailed status of the current workspace')
  .action(statusCommand);

program.parse(process.argv);
