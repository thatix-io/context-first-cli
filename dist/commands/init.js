"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function initCommand() {
    console.log(chalk_1.default.blue.bold('\n🚀 Initializing Context-First in this project\n'));
    try {
        // Check if already initialized
        const configPath = path_1.default.join(process.cwd(), '.contextrc.json');
        const exists = await promises_1.default.access(configPath).then(() => true).catch(() => false);
        if (exists) {
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Configuration file already exists. Overwrite?',
                    default: false,
                },
            ]);
            if (!overwrite) {
                console.log(chalk_1.default.yellow('✋ Initialization cancelled'));
                return;
            }
        }
        // Prompt for configuration
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'orchestratorRepo',
                message: 'Git URL of your Orchestrator repository:',
                validate: (input) => {
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
        let commandsDir;
        if (answers.aiProvider === 'custom' && answers.customCommandsDir) {
            commandsDir = answers.customCommandsDir;
        }
        else {
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
        await promises_1.default.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
        console.log(chalk_1.default.green('\n✅ Configuration saved to .contextrc.json'));
        console.log(chalk_1.default.gray('\nConfiguration:'));
        console.log(chalk_1.default.gray(`  Orchestrator: ${config.orchestratorRepo}`));
        console.log(chalk_1.default.gray(`  AI Provider: ${config.aiProvider}`));
        console.log(chalk_1.default.gray(`  Commands Directory: ${config.commandsDir}`));
        console.log(chalk_1.default.blue('\n💡 Next steps:'));
        console.log(chalk_1.default.gray('  1. Run "context-cli link" to create command delegation files'));
        console.log(chalk_1.default.gray('  2. Run "context-cli feature:start <issue-id>" to begin working on a feature'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error during initialization:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map