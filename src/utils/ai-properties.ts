import fs from 'fs/promises';
import path from 'path';

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
  azure_organization?: string;
  azure_project?: string;
  azure_team?: string;
  branch_prefix?: string;
  branch_pattern?: string;
  [key: string]: any;
}

/**
 * Parse ai.properties.md file into a key-value object
 */
export async function loadAiProperties(orchestratorPath: string): Promise<AiProperties | null> {
  try {
    const propertiesPath = path.join(orchestratorPath, 'ai.properties.md');
    const content = await fs.readFile(propertiesPath, 'utf-8');
    
    const properties: AiProperties = {};
    
    // Parse simple key=value lines
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines, comments, and markdown headers
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
        continue;
      }
      
      // Parse key=value
      const match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_.]*)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        
        // Convert string booleans to actual booleans
        if (value.toLowerCase() === 'true') {
          properties[key] = true;
        } else if (value.toLowerCase() === 'false') {
          properties[key] = false;
        } else {
          properties[key] = value;
        }
      }
    }
    
    return properties;
  } catch (error) {
    return null;
  }
}

/**
 * Get the base path where repositories should be located
 */
export function getBasePath(properties: AiProperties | null): string | null {
  if (!properties || !properties.base_path) {
    return null;
  }
  
  // Expand ~ to home directory
  let basePath = properties.base_path;
  if (basePath.startsWith('~')) {
    basePath = basePath.replace('~', process.env.HOME || '~');
  }
  
  return basePath;
}

/**
 * Check if auto_clone is enabled
 */
export function isAutoCloneEnabled(properties: AiProperties | null): boolean {
  if (!properties) {
    return false;
  }
  
  return properties.auto_clone === true;
}
