"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.findConfig = findConfig;
exports.loadManifest = loadManifest;
exports.loadWorkspaceMetadata = loadWorkspaceMetadata;
exports.saveWorkspaceMetadata = saveWorkspaceMetadata;
exports.ensureDir = ensureDir;
exports.pathExists = pathExists;
exports.exitWithError = exitWithError;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * Load the .contextrc.json configuration file
 */
async function loadConfig(cwd = process.cwd()) {
    try {
        const configPath = path_1.default.join(cwd, '.contextrc.json');
        const content = await promises_1.default.readFile(configPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        return null;
    }
}
/**
 * Find the nearest .contextrc.json by walking up the directory tree
 */
async function findConfig(startDir = process.cwd()) {
    let currentDir = startDir;
    while (true) {
        const config = await loadConfig(currentDir);
        if (config) {
            return { config, configDir: currentDir };
        }
        const parentDir = path_1.default.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached root
            return null;
        }
        currentDir = parentDir;
    }
}
/**
 * Load the context-manifest.json from the orchestrator
 */
async function loadManifest(orchestratorPath) {
    try {
        const manifestPath = path_1.default.join(orchestratorPath, 'context-manifest.json');
        const content = await promises_1.default.readFile(manifestPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        return null;
    }
}
/**
 * Load workspace metadata
 */
async function loadWorkspaceMetadata(workspacePath) {
    try {
        const metadataPath = path_1.default.join(workspacePath, '.workspace.json');
        const content = await promises_1.default.readFile(metadataPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        return null;
    }
}
/**
 * Save workspace metadata
 */
async function saveWorkspaceMetadata(workspacePath, metadata) {
    const metadataPath = path_1.default.join(workspacePath, '.workspace.json');
    await promises_1.default.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}
/**
 * Ensure a directory exists
 */
async function ensureDir(dirPath) {
    try {
        await promises_1.default.mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        // Ignore if already exists
    }
}
/**
 * Check if a path exists
 */
async function pathExists(filePath) {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Display error and exit
 */
function exitWithError(message) {
    console.error(chalk_1.default.red(`\n❌ ${message}\n`));
    process.exit(1);
}
//# sourceMappingURL=config.js.map