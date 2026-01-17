#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const scaffold_orchestrator_1 = require("./commands/scaffold-orchestrator");
const feature_1 = require("./commands/feature");
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
    .command('scaffold:orchestrator')
    .description('Create a new orchestrator repository from a template')
    .action(scaffold_orchestrator_1.scaffoldOrchestratorCommand);
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
    .command('end <issue-id>')
    .description('Archive and clean up a completed feature workspace')
    .action(feature_1.featureCommands.end);
// Process commands (to be implemented)
program
    .command('collect <message>')
    .description('Collect a new idea or bug')
    .action((message) => {
    console.log(chalk_1.default.yellow('🚧 Command "collect" is not yet implemented'));
    console.log(chalk_1.default.gray(`Message: ${message}`));
});
program
    .command('spec')
    .description('Generate specification (PRD) for the current feature')
    .action(() => {
    console.log(chalk_1.default.yellow('🚧 Command "spec" is not yet implemented'));
});
program
    .command('work <message>')
    .description('Record a unit of work and commit')
    .action((message) => {
    console.log(chalk_1.default.yellow('🚧 Command "work" is not yet implemented'));
    console.log(chalk_1.default.gray(`Message: ${message}`));
});
program
    .command('pr')
    .description('Create Pull Requests for the current feature')
    .action(() => {
    console.log(chalk_1.default.yellow('🚧 Command "pr" is not yet implemented'));
});
// Diagnostic commands
program
    .command('doctor')
    .description('Check environment and configuration')
    .action(() => {
    console.log(chalk_1.default.yellow('🚧 Command "doctor" is not yet implemented'));
});
program
    .command('status')
    .description('Show detailed status of the current workspace')
    .action(() => {
    console.log(chalk_1.default.yellow('🚧 Command "status" is not yet implemented'));
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map