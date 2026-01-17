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
export declare function loadConfig(cwd?: string): Promise<ContextConfig | null>;
/**
 * Find the nearest .contextrc.json by walking up the directory tree
 */
export declare function findConfig(startDir?: string): Promise<{
    config: ContextConfig;
    configDir: string;
} | null>;
/**
 * Load the context-manifest.json from the orchestrator
 */
export declare function loadManifest(orchestratorPath: string): Promise<ContextManifest | null>;
/**
 * Load workspace metadata
 */
export declare function loadWorkspaceMetadata(workspacePath: string): Promise<WorkspaceMetadata | null>;
/**
 * Save workspace metadata
 */
export declare function saveWorkspaceMetadata(workspacePath: string, metadata: WorkspaceMetadata): Promise<void>;
/**
 * Get the workspaces directory path
 */
export declare function getWorkspacesDir(): string;
/**
 * Ensure a directory exists
 */
export declare function ensureDir(dirPath: string): Promise<void>;
/**
 * Check if a path exists
 */
export declare function pathExists(filePath: string): Promise<boolean>;
/**
 * Display error and exit
 */
export declare function exitWithError(message: string): never;
//# sourceMappingURL=config.d.ts.map