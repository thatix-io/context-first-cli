"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAiProperties = loadAiProperties;
exports.getBasePath = getBasePath;
exports.isAutoCloneEnabled = isAutoCloneEnabled;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Parse ai.properties.md file into a key-value object
 */
async function loadAiProperties(orchestratorPath) {
    try {
        const propertiesPath = path_1.default.join(orchestratorPath, 'ai.properties.md');
        const content = await promises_1.default.readFile(propertiesPath, 'utf-8');
        const properties = {};
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
                }
                else if (value.toLowerCase() === 'false') {
                    properties[key] = false;
                }
                else {
                    properties[key] = value;
                }
            }
        }
        return properties;
    }
    catch (error) {
        return null;
    }
}
/**
 * Get the base path where repositories should be located
 */
function getBasePath(properties) {
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
function isAutoCloneEnabled(properties) {
    if (!properties) {
        return false;
    }
    return properties.auto_clone === true;
}
//# sourceMappingURL=ai-properties.js.map