import fs from "node:fs";
import path from "node:path";
import { changelogHead, clear, cwd, dim, green, sh, yellow } from "./funcs.js";

function updateChangelog(dir, target, version) {
  const changelogPath = path.join(dir, "CHANGELOG.md");
  const changelog = fs.readFileSync(changelogPath, "utf-8");

  const relevant = changelog.split("## Unreleased\n")[1];

  const newChangelog = [
    changelogHead(target),
    "",
    `## ${version} - ${new Date().toISOString().split("T")[0]}`,
    relevant,
  ].join("\n");

  fs.writeFileSync(changelogPath, newChangelog);

  if (dryRun) return;

  sh(`git add ${dir}`);
  sh(`git diff-index --quiet HEAD || git commit -m ":bookmark: ${target}@${version}"`);
}

const FAIL = "fail";

const dryRun = process.argv.includes("--dry-run");

const packagesDir = path.join(cwd, "packages");

for (const target of fs.readdirSync(packagesDir)) {
  const dir = path.join(packagesDir, target);
  if (!fs.statSync(dir).isDirectory()) continue;
  const packageJsonPath = path.join(dir, "package.json");
  const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const packageName = packageJsonData.name;
  /**@type {string}*/
  const packageVersion = packageJsonData.version;

  const versionNpm = sh(`npm view ${packageName} version || echo "${FAIL}"`);
  if (versionNpm !== FAIL && versionNpm === packageVersion) {
    console.log(yellow(`~ ${packageName}@^${packageVersion}`), clear);
    continue;
  }

  updateChangelog(dir, target, packageVersion);
  const publishOutput = sh(`cd ${dir} && npm publish --access public ${dryRun ? "--dry-run" : ""}`);
  console.log(green(publishOutput), clear, dryRun ? dim("(dry run)") : "", clear);
}
