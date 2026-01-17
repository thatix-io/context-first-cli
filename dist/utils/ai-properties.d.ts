export interface AiProperties {
    base_path?: string;
    auto_clone?: boolean;
    task_management_system?: string;
    jira_site?: string;
    jira_cloud_id?: string;
    jira_project_key?: string;
    jira_project_id?: string;
    linear_api_key?: string;
    linear_team_id?: string;
    github_org?: string;
    github_repo?: string;
    branch_prefix?: string;
    branch_pattern?: string;
    [key: string]: any;
}
/**
 * Parse ai.properties.md file into a key-value object
 */
export declare function loadAiProperties(orchestratorPath: string): Promise<AiProperties | null>;
/**
 * Get the base path where repositories should be located
 */
export declare function getBasePath(properties: AiProperties | null): string | null;
/**
 * Check if auto_clone is enabled
 */
export declare function isAutoCloneEnabled(properties: AiProperties | null): boolean;
//# sourceMappingURL=ai-properties.d.ts.map