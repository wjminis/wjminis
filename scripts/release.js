import fs from "node:fs";
import path from "node:path";
import { cwd, sh } from "./sh.js";

const dryRun = process.argv.includes("--dry-run");

const packagesDir = path.join(cwd, "packages");

const packageDirs = [];

for (const dir of fs.readdirSync(packagesDir)) {
  const absDir = path.join(packagesDir, dir);
  if (!fs.statSync(absDir).isDirectory()) continue;
  const packageJsonPath = path.join(absDir, "package.json");
  const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const packageName = packageJsonData.name;
  const packageVersion = packageJsonData.version;

  const versionNpm = sh(`npm view ${packageName} version || echo "no-version"`);
  if (versionNpm !== "no-version\n" && versionNpm === packageVersion) continue;
  packageDirs.push(absDir);
}

console.log(
  "\n\n\n--------------------------------------------------------------------------------\n\n\n",
);

for (const dir of packageDirs) {
  console.log(`Publishing ${dir}`);
  sh(`cd ${dir} && npm publish --access public ${dryRun ? "--dry-run" : ""}`);
}
