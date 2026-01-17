import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export interface ContextConfig {
  orchestratorRepo: string;
  aiProvider: 'claude' | 'cursor' | 'custom';
  commandsDir: string;
  version: string;
  createdAt: string;
}

export interface ContextManifest {
  version: string;
  project: string;
  description: string;
  repositories: Repository[];
}

export interface Repository {
  id: string;
  role: 'specs-provider' | 'application' | 'service';
  url: string;
  dependsOn?: string[];
  description: string;
}

export interface WorkspaceMetadata {
  issueId: string;
  repositories: string[];
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'archived';
}

/**
 * Load the .contextrc.json configuration file
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<ContextConfig | null> {
  try {
    const configPath = path.join(cwd, '.contextrc.json');
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Find the nearest .contextrc.json by walking up the directory tree
 */
export async function findConfig(startDir: string = process.cwd()): Promise<{ config: ContextConfig; configDir: string } | null> {
  let currentDir = startDir;
  
  while (true) {
    const config = await loadConfig(currentDir);
    if (config) {
      return { config, configDir: currentDir };
    }
    
    const parentDir = path.dirname(currentDir);
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
export async function loadManifest(orchestratorPath: string): Promise<ContextManifest | null> {
  try {
    const manifestPath = path.join(orchestratorPath, 'context-manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Load workspace metadata
 */
export async function loadWorkspaceMetadata(workspacePath: string): Promise<WorkspaceMetadata | null> {
  try {
    const metadataPath = path.join(workspacePath, '.workspace.json');
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Save workspace metadata
 */
export async function saveWorkspaceMetadata(workspacePath: string, metadata: WorkspaceMetadata): Promise<void> {
  const metadataPath = path.join(workspacePath, '.workspace.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}

/**
 * Get the workspaces directory path
 */
export function getWorkspacesDir(): string {
  return path.join(process.env.HOME || process.env.USERPROFILE || '/tmp', '.context-workspaces');
}

/**
 * Ensure a directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Ignore if already exists
  }
}

/**
 * Check if a path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Display error and exit
 */
export function exitWithError(message: string): never {
  console.error(chalk.red(`\n❌ ${message}\n`));
  process.exit(1);
}
