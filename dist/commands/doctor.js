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
exports.doctorCommand = doctorCommand;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
const git_1 = require("../utils/git");
async function doctorCommand() {
    console.log(chalk_1.default.blue.bold('\n🏥 Running environment diagnostics...\n'));
    const results = [];
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
    console.log(chalk_1.default.bold('\n📊 Diagnostic Results:\n'));
    for (const result of results) {
        const icon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗';
        const color = result.status === 'pass' ? chalk_1.default.green : result.status === 'warn' ? chalk_1.default.yellow : chalk_1.default.red;
        console.log(color(`${icon} ${result.name}`));
        console.log(chalk_1.default.gray(`  ${result.message}`));
    }
    // Summary
    const passed = results.filter(r => r.status === 'pass').length;
    const warned = results.filter(r => r.status === 'warn').length;
    const failed = results.filter(r => r.status === 'fail').length;
    console.log(chalk_1.default.bold('\n📈 Summary:'));
    console.log(chalk_1.default.green(`  ✓ Passed: ${passed}`));
    if (warned > 0)
        console.log(chalk_1.default.yellow(`  ⚠ Warnings: ${warned}`));
    if (failed > 0)
        console.log(chalk_1.default.red(`  ✗ Failed: ${failed}`));
    if (failed > 0) {
        console.log(chalk_1.default.red('\n❌ Some checks failed. Please address the issues above.'));
        process.exit(1);
    }
    else if (warned > 0) {
        console.log(chalk_1.default.yellow('\n⚠️  Some checks have warnings. Review them if needed.'));
    }
    else {
        console.log(chalk_1.default.green('\n✅ All checks passed! Your environment is ready.'));
    }
}
async function checkGit() {
    try {
        const version = (0, child_process_1.execSync)('git --version', { encoding: 'utf-8' }).trim();
        return {
            name: 'Git Installation',
            status: 'pass',
            message: version,
        };
    }
    catch (error) {
        return {
            name: 'Git Installation',
            status: 'fail',
            message: 'Git is not installed or not in PATH',
        };
    }
}
async function checkNode() {
    try {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        if (major >= 18) {
            return {
                name: 'Node.js Version',
                status: 'pass',
                message: `Node.js ${version} (recommended: >= 18)`,
            };
        }
        else {
            return {
                name: 'Node.js Version',
                status: 'warn',
                message: `Node.js ${version} (recommended: >= 18)`,
            };
        }
    }
    catch (error) {
        return {
            name: 'Node.js Version',
            status: 'fail',
            message: 'Could not determine Node.js version',
        };
    }
}
async function checkConfiguration() {
    const configResult = await (0, config_1.findConfig)();
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
async function checkOrchestrator() {
    const configResult = await (0, config_1.findConfig)();
    if (!configResult)
        return null;
    const { config, configDir } = configResult;
    const orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
    if (!(await (0, config_1.pathExists)(orchestratorPath))) {
        return {
            name: 'Orchestrator Repository',
            status: 'warn',
            message: 'Not cloned yet. Will be cloned on first "feature:start".',
        };
    }
    const isRepo = await (0, git_1.isGitRepo)(orchestratorPath);
    if (!isRepo) {
        return {
            name: 'Orchestrator Repository',
            status: 'fail',
            message: `Directory exists at ${orchestratorPath} but is not a valid Git repository`,
        };
    }
    const manifest = await (0, config_1.loadManifest)(orchestratorPath);
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
async function checkMainRepositories() {
    const configResult = await (0, config_1.findConfig)();
    if (!configResult)
        return null;
    const { configDir } = configResult;
    const mainReposDir = path_1.default.join(configDir, '.context-repos');
    if (!(await (0, config_1.pathExists)(mainReposDir))) {
        return {
            name: 'Main Repositories',
            status: 'warn',
            message: 'No main repositories cloned yet. Will be cloned on first "feature:start".',
        };
    }
    const orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
    const manifest = await (0, config_1.loadManifest)(orchestratorPath);
    if (!manifest) {
        return null;
    }
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
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
    }
    else if (clonedCount < totalCount) {
        return {
            name: 'Main Repositories',
            status: 'pass',
            message: `${clonedCount}/${totalCount} repositories cloned`,
        };
    }
    else {
        return {
            name: 'Main Repositories',
            status: 'pass',
            message: `All ${totalCount} repositories cloned`,
        };
    }
}
async function checkWorkspacesDirectory() {
    const configResult = await (0, config_1.findConfig)();
    if (!configResult) {
        return {
            name: 'Workspaces Directory',
            status: 'warn',
            message: 'No configuration found',
        };
    }
    const { configDir } = configResult;
    const orchestratorPath = path_1.default.join(configDir, '.context-orchestrator');
    const sessionsDir = path_1.default.join(orchestratorPath, '.sessions');
    if (!(await (0, config_1.pathExists)(sessionsDir))) {
        return {
            name: 'Workspaces Directory',
            status: 'warn',
            message: `No workspaces created yet (${sessionsDir})`,
        };
    }
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
    const entries = await fs.readdir(sessionsDir, { withFileTypes: true });
    const workspaceCount = entries.filter(e => e.isDirectory()).length;
    return {
        name: 'Workspaces Directory',
        status: 'pass',
        message: `${workspaceCount} workspace(s) found at ${sessionsDir}`,
    };
}
//# sourceMappingURL=doctor.js.map