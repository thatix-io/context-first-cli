"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractIssueNumber = extractIssueNumber;
exports.calculatePorts = calculatePorts;
exports.generateDockerComposeContent = generateDockerComposeContent;
exports.generateDockerCompose = generateDockerCompose;
exports.cleanupDockerContainers = cleanupDockerContainers;
exports.checkDockerAvailable = checkDockerAvailable;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
/**
 * Extract issue number from issue-id
 * Examples: FIN-11 → 11, PROJ-123 → 123
 */
function extractIssueNumber(issueId) {
    const match = issueId.match(/\d+$/);
    if (!match) {
        throw new Error(`Could not extract number from issue-id: ${issueId}`);
    }
    return parseInt(match[0], 10);
}
/**
 * Calculate dynamic ports based on issue number
 */
function calculatePorts(issueNumber, basePorts) {
    return {
        backend: (basePorts.backend || 3000) + issueNumber,
        frontend: (basePorts.frontend || 8000) + issueNumber,
        postgres: (basePorts.postgres || 5400) + issueNumber,
        redis: (basePorts.redis || 6300) + issueNumber,
    };
}
/**
 * Generate docker-compose.yml content
 */
function generateDockerComposeContent(issueId, repositories, ports) {
    const issueNumber = extractIssueNumber(issueId);
    const networkName = `${issueId.toLowerCase()}-network`;
    const volumePrefix = issueId.toLowerCase();
    // Find repositories by role
    const backendRepo = repositories.find(r => r.role === 'backend');
    const frontendRepo = repositories.find(r => r.role === 'frontend');
    let services = '';
    let volumes = '';
    // Backend service
    if (backendRepo) {
        services += `  backend:
    build:
      context: ./${backendRepo.id}
      dockerfile: Dockerfile
    container_name: ${issueId.toLowerCase()}-backend
    ports:
      - "${ports.backend}:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgresql://user:password@postgres:5432/app
      - REDIS_URL=redis://redis:6379
    networks:
      - ${networkName}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./${backendRepo.id}:/app
      - /app/node_modules

`;
    }
    // Frontend service
    if (frontendRepo) {
        services += `  frontend:
    build:
      context: ./${frontendRepo.id}
      dockerfile: Dockerfile
    container_name: ${issueId.toLowerCase()}-frontend
    ports:
      - "${ports.frontend}:8080"
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:${ports.backend}
    networks:
      - ${networkName}
    ${backendRepo ? 'depends_on:\n      - backend' : ''}
    volumes:
      - ./${frontendRepo.id}:/app
      - /app/node_modules

`;
    }
    // Postgres service
    services += `  postgres:
    image: postgres:15-alpine
    container_name: ${issueId.toLowerCase()}-postgres
    ports:
      - "${ports.postgres}:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app
    networks:
      - ${networkName}
    volumes:
      - ${volumePrefix}-postgres-data:/var/lib/postgresql/data

`;
    volumes += `  ${volumePrefix}-postgres-data:\n`;
    // Redis service
    services += `  redis:
    image: redis:7-alpine
    container_name: ${issueId.toLowerCase()}-redis
    ports:
      - "${ports.redis}:6379"
    networks:
      - ${networkName}
    volumes:
      - ${volumePrefix}-redis-data:/data

`;
    volumes += `  ${volumePrefix}-redis-data:\n`;
    return `version: '3.8'

services:
${services}
networks:
  ${networkName}:
    name: ${networkName}

volumes:
${volumes}`;
}
/**
 * Generate docker-compose.yml file in workspace
 */
async function generateDockerCompose(workspacePath, issueId, repositories, basePorts) {
    try {
        const issueNumber = extractIssueNumber(issueId);
        const ports = calculatePorts(issueNumber, basePorts || {});
        const content = generateDockerComposeContent(issueId, repositories, ports);
        const filePath = path_1.default.join(workspacePath, 'docker-compose.yml');
        await promises_1.default.writeFile(filePath, content, 'utf-8');
        console.log(chalk_1.default.green(`✓ Generated docker-compose.yml`));
        console.log(chalk_1.default.blue('\n📦 Docker Services:'));
        console.log(chalk_1.default.gray(`   Backend:  http://localhost:${ports.backend}`));
        console.log(chalk_1.default.gray(`   Frontend: http://localhost:${ports.frontend}`));
        console.log(chalk_1.default.gray(`   Postgres: localhost:${ports.postgres}`));
        console.log(chalk_1.default.gray(`   Redis:    localhost:${ports.redis}`));
    }
    catch (error) {
        console.log(chalk_1.default.yellow(`⚠ Could not generate docker-compose.yml: ${error.message}`));
    }
}
/**
 * Stop and remove Docker containers for a workspace
 */
async function cleanupDockerContainers(workspacePath, issueId) {
    try {
        const dockerComposePath = path_1.default.join(workspacePath, 'docker-compose.yml');
        // Check if docker-compose.yml exists
        try {
            await promises_1.default.access(dockerComposePath);
        }
        catch {
            // No docker-compose.yml, nothing to clean up
            return;
        }
        console.log(chalk_1.default.blue('Stopping Docker containers...'));
        try {
            (0, child_process_1.execSync)('docker-compose down -v', {
                cwd: workspacePath,
                stdio: 'pipe',
            });
            console.log(chalk_1.default.green('✓ Docker containers stopped and removed'));
        }
        catch (error) {
            console.log(chalk_1.default.yellow(`⚠ Could not stop Docker containers: ${error.message}`));
        }
    }
    catch (error) {
        console.log(chalk_1.default.yellow(`⚠ Error cleaning up Docker: ${error.message}`));
    }
}
/**
 * Check if Docker is installed and running
 */
async function checkDockerAvailable() {
    try {
        (0, child_process_1.execSync)('docker --version', { stdio: 'pipe' });
        (0, child_process_1.execSync)('docker ps', { stdio: 'pipe' });
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=docker.js.map