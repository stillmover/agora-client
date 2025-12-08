import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findEnvExampleFiles(dir: string, r: string[] = []): string[] {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (["node_modules", ".git", "dist", "dev-dist", ".cursor"].includes(item)) {
      continue;
    }

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      findEnvExampleFiles(fullPath, r);
    } else if (item === ".env.example") {
      r.push(fullPath);
    }
  }

  return r;
}

function createEnvFile(envExamplePath: string): boolean {
  const envPath = path.join(path.dirname(envExamplePath), ".env");

  if (fs.existsSync(envPath)) {
    return false;
  }

  try {
    fs.copyFileSync(envExamplePath, envPath);
    return true;
  } catch (error) {
    console.error(
      `Failed to create .env file: ${envPath}`,
      error instanceof Error ? error.message : String(error),
    );
    return false;
  }
}

function setupDev(): void {
  const projectRoot = path.join(__dirname, "..");

  const envExampleFiles = findEnvExampleFiles(projectRoot);

  if (envExampleFiles.length === 0) {
    console.log("No .env.example files found");
    return;
  }

  const created = envExampleFiles.map(createEnvFile);
  const createdCount = created.filter(Boolean).length;

  if (createdCount > 0) {
    console.log(
      `✅ Development environment setup complete! Created ${createdCount} .env file(s)`,
    );
  } else {
    console.log("✅ All .env files already exist");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDev();
}

export { createEnvFile, findEnvExampleFiles, setupDev };
