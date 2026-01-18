/**
 * Extract issue number from issue-id
 * Examples: FIN-11 → 11, PROJ-123 → 123
 */
export declare function extractIssueNumber(issueId: string): number;
/**
 * Calculate dynamic ports based on issue number
 */
export declare function calculatePorts(issueNumber: number, basePorts: {
    backend?: number;
    frontend?: number;
    postgres?: number;
    redis?: number;
}): {
    backend: number;
    frontend: number;
    postgres: number;
    redis: number;
};
/**
 * Generate docker-compose.yml content
 */
export declare function generateDockerComposeContent(issueId: string, repositories: Array<{
    id: string;
    role?: string;
}>, ports: {
    backend: number;
    frontend: number;
    postgres: number;
    redis: number;
}): string;
/**
 * Generate docker-compose.yml file in workspace
 */
export declare function generateDockerCompose(workspacePath: string, issueId: string, repositories: Array<{
    id: string;
    role?: string;
}>, basePorts?: {
    backend?: number;
    frontend?: number;
    postgres?: number;
    redis?: number;
}): Promise<void>;
/**
 * Stop and remove Docker containers for a workspace
 */
export declare function cleanupDockerContainers(workspacePath: string, issueId: string): Promise<void>;
/**
 * Check if Docker is installed and running
 */
export declare function checkDockerAvailable(): Promise<boolean>;
//# sourceMappingURL=docker.d.ts.map