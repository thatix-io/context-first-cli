"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommands = updateCommands;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
async function updateCommands() {
    console.log(chalk_1.default.blue('\n🔄 Update Commands\n'));
    // 1. Verificar se está em um orchestrator
    const manifestPath = path.join(process.cwd(), 'context-manifest.json');
    if (!fs.existsSync(manifestPath)) {
        console.log(chalk_1.default.red('❌ Error: context-manifest.json not found'));
        console.log(chalk_1.default.yellow('This command must be run from an orchestrator directory'));
        process.exit(1);
    }
    console.log(chalk_1.default.green('✓ Found orchestrator directory'));
    // 2. Detectar qual pasta de comandos existe
    const claudeCommandsPath = path.join(process.cwd(), '.claude', 'commands');
    const cursorCommandsPath = path.join(process.cwd(), '.cursor', 'commands');
    let commandsPath;
    let aiProvider;
    if (fs.existsSync(claudeCommandsPath)) {
        commandsPath = claudeCommandsPath;
        aiProvider = 'claude';
    }
    else if (fs.existsSync(cursorCommandsPath)) {
        commandsPath = cursorCommandsPath;
        aiProvider = 'cursor';
    }
    else {
        console.log(chalk_1.default.red('❌ Error: No commands directory found'));
        console.log(chalk_1.default.yellow('Expected .claude/commands or .cursor/commands'));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`✓ Found ${aiProvider} commands directory`));
    // 3. Fazer backup dos comandos atuais
    const backupPath = path.join(process.cwd(), `.${aiProvider}-commands-backup-${Date.now()}`);
    const { shouldBackup } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'shouldBackup',
            message: 'Create backup of current commands before updating?',
            default: true,
        },
    ]);
    if (shouldBackup) {
        fs.cpSync(commandsPath, backupPath, { recursive: true });
        console.log(chalk_1.default.green(`✓ Backup created at: ${backupPath}`));
    }
    // 4. Perguntar quais comandos atualizar
    const { updateMode } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'updateMode',
            message: 'Which commands do you want to update?',
            choices: [
                { name: 'All commands (recommended)', value: 'all' },
                { name: 'Select specific commands', value: 'selective' },
            ],
        },
    ]);
    // 5. Detectar idioma do workspace (se houver)
    let language = 'en'; // default
    const sessionsDir = path.join(process.cwd(), '.sessions');
    if (fs.existsSync(sessionsDir)) {
        // Tentar encontrar um workspace existente para detectar idioma
        const workspaces = fs.readdirSync(sessionsDir);
        if (workspaces.length > 0) {
            const firstWorkspace = workspaces[0];
            const metadataPath = path.join(sessionsDir, firstWorkspace, '.workspace.json');
            if (fs.existsSync(metadataPath)) {
                try {
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
                    if (metadata.language) {
                        language = metadata.language;
                        console.log(chalk_1.default.gray(`✓ Detected language from workspace: ${language}`));
                    }
                }
                catch (error) {
                    // Ignore errors, use default
                }
            }
        }
    }
    // Se não detectou, perguntar
    if (language === 'en') {
        const { selectedLanguage } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selectedLanguage',
                message: 'Select language for AI commands:',
                choices: [
                    { name: '🇺🇸 English', value: 'en' },
                    { name: '🇪🇸 Español', value: 'es' },
                    { name: '🇧🇷 Português (Brasil)', value: 'pt-BR' },
                ],
                default: 'en',
            },
        ]);
        language = selectedLanguage;
    }
    // 6. Copiar templates atualizados
    const templatesPath = path.join(__dirname, '..', 'templates', 'commands', language);
    if (!fs.existsSync(templatesPath)) {
        console.log(chalk_1.default.red('❌ Error: Templates not found'));
        console.log(chalk_1.default.yellow('Please reinstall context-first-cli'));
        process.exit(1);
    }
    if (updateMode === 'all') {
        // Atualizar todos os comandos
        fs.cpSync(templatesPath, commandsPath, { recursive: true });
        console.log(chalk_1.default.green('✓ All commands updated successfully'));
    }
    else {
        // Modo seletivo
        const availableCommands = getAllCommandFiles(templatesPath);
        const { selectedCommands } = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'selectedCommands',
                message: 'Select commands to update:',
                choices: availableCommands.map(cmd => ({
                    name: cmd.replace(/\//g, ' / '),
                    value: cmd,
                })),
            },
        ]);
        // Copiar apenas os comandos selecionados
        for (const command of selectedCommands) {
            const sourcePath = path.join(templatesPath, command);
            const destPath = path.join(commandsPath, command);
            // Criar diretório se não existir
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(sourcePath, destPath);
            console.log(chalk_1.default.green(`✓ Updated: ${command}`));
        }
    }
    console.log(chalk_1.default.blue('\n✨ Commands updated successfully!\n'));
    if (shouldBackup) {
        console.log(chalk_1.default.yellow(`💡 Backup location: ${backupPath}`));
        console.log(chalk_1.default.yellow('   You can restore from backup if needed\n'));
    }
}
function getAllCommandFiles(dir, baseDir = dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files.push(...getAllCommandFiles(fullPath, baseDir));
        }
        else if (item.endsWith('.md')) {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }
    return files.sort();
}
//# sourceMappingURL=update-commands.js.map