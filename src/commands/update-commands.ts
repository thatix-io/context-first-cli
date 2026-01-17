import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function updateCommands() {
  console.log(chalk.blue('\n🔄 Update Commands\n'));

  // 1. Verificar se está em um orchestrator
  const manifestPath = path.join(process.cwd(), 'context-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log(chalk.red('❌ Error: context-manifest.json not found'));
    console.log(chalk.yellow('This command must be run from an orchestrator directory'));
    process.exit(1);
  }

  console.log(chalk.green('✓ Found orchestrator directory'));

  // 2. Detectar qual pasta de comandos existe
  const claudeCommandsPath = path.join(process.cwd(), '.claude', 'commands');
  const cursorCommandsPath = path.join(process.cwd(), '.cursor', 'commands');
  
  let commandsPath: string;
  let aiProvider: string;

  if (fs.existsSync(claudeCommandsPath)) {
    commandsPath = claudeCommandsPath;
    aiProvider = 'claude';
  } else if (fs.existsSync(cursorCommandsPath)) {
    commandsPath = cursorCommandsPath;
    aiProvider = 'cursor';
  } else {
    console.log(chalk.red('❌ Error: No commands directory found'));
    console.log(chalk.yellow('Expected .claude/commands or .cursor/commands'));
    process.exit(1);
  }

  console.log(chalk.green(`✓ Found ${aiProvider} commands directory`));

  // 3. Fazer backup dos comandos atuais
  const backupPath = path.join(process.cwd(), `.${aiProvider}-commands-backup-${Date.now()}`);
  
  const { shouldBackup } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldBackup',
      message: 'Create backup of current commands before updating?',
      default: true,
    },
  ]);

  if (shouldBackup) {
    fs.cpSync(commandsPath, backupPath, { recursive: true });
    console.log(chalk.green(`✓ Backup created at: ${backupPath}`));
  }

  // 4. Perguntar quais comandos atualizar
  const { updateMode } = await inquirer.prompt([
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

  // 5. Copiar templates atualizados
  const templatesPath = path.join(__dirname, '..', 'templates', 'commands');
  
  if (!fs.existsSync(templatesPath)) {
    console.log(chalk.red('❌ Error: Templates not found'));
    console.log(chalk.yellow('Please reinstall context-first-cli'));
    process.exit(1);
  }

  if (updateMode === 'all') {
    // Atualizar todos os comandos
    fs.cpSync(templatesPath, commandsPath, { recursive: true });
    console.log(chalk.green('✓ All commands updated successfully'));
  } else {
    // Modo seletivo
    const availableCommands = getAllCommandFiles(templatesPath);
    
    const { selectedCommands } = await inquirer.prompt([
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
      console.log(chalk.green(`✓ Updated: ${command}`));
    }
  }

  console.log(chalk.blue('\n✨ Commands updated successfully!\n'));
  
  if (shouldBackup) {
    console.log(chalk.yellow(`💡 Backup location: ${backupPath}`));
    console.log(chalk.yellow('   You can restore from backup if needed\n'));
  }
}

function getAllCommandFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllCommandFiles(fullPath, baseDir));
    } else if (item.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files.sort();
}
