#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const create_orchestrator_1 = require("./commands/create-orchestrator");
const add_repo_1 = require("./commands/add-repo");
const add_repo_metaspec_1 = require("./commands/add-repo-metaspec");
const config_setup_1 = require("./commands/config-setup");
const update_commands_1 = require("./commands/update-commands");
const feature_1 = require("./commands/feature");
const doctor_1 = require("./commands/doctor");
const status_1 = require("./commands/status");
const program = new commander_1.Command();
program
    .name('context-cli')
    .description('A CLI to manage the Context-First development methodology across any project')
    .version('1.0.0');
// Setup commands
program
    .command('init')
    .description('Initialize Context-First in an existing project')
    .action(init_1.initCommand);
program
    .command('create:orchestrator')
    .description('Create a new orchestrator repository from a template')
    .action(create_orchestrator_1.createOrchestratorCommand);
program
    .command('add:repo')
    .description('Add a new code repository to context-manifest.json')
    .action(add_repo_1.addRepoCommand);
program
    .command('add:repo-metaspec')
    .description('Add or update the MetaSpecs repository in context-manifest.json')
    .action(add_repo_metaspec_1.addRepoMetaspecCommand);
program
    .command('config:setup')
    .description('Interactively configure ai.properties.md for local development')
    .action(config_setup_1.configSetupCommand);
program
    .command('update:commands')
    .description('Update command templates in an existing orchestrator')
    .action(update_commands_1.updateCommands);
// Feature management commands
const feature = program.command('feature').description('Manage feature workspaces');
feature
    .command('start <issue-id>')
    .description('Create a new feature workspace')
    .option('-r, --repos <repos>', 'Comma-separated list of repositories to include')
    .action(feature_1.featureCommands.start);
feature
    .command('list')
    .description('List all active feature workspaces')
    .action(feature_1.featureCommands.list);
feature
    .command('switch <issue-id>')
    .description('Switch to an existing feature workspace')
    .action(feature_1.featureCommands.switch);
feature
    .command('merge <issue-id>')
    .description('Merge feature branch into target branch and clean up workspace')
    .option('-t, --target-branch <branch>', 'Target branch to merge into (default: main)')
    .option('--no-push', 'Do not push changes after merge')
    .option('--keep-workspace', 'Keep workspace after merge')
    .option('-f, --force', 'Force merge without confirmation')
    .action(feature_1.featureCommands.merge);
feature
    .command('end <issue-id>')
    .description('Archive and clean up a completed feature workspace')
    .option('-f, --force', 'Force cleanup without confirmation')
    .action(feature_1.featureCommands.end);
// Diagnostic commands
program
    .command('doctor')
    .description('Check environment and configuration')
    .action(doctor_1.doctorCommand);
program
    .command('status')
    .description('Show detailed status of the current workspace')
    .action(status_1.statusCommand);
program.parse(process.argv);
//# sourceMappingURL=index.js.map