import path from "node:path";
import child from "node:child_process";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const cwd = path.join(__dirname, "..");

/**
 * @param {string} cmd
 */
export function sh(cmd) {
  return child.execSync(cmd, { cwd, stdio: ["pipe", "pipe", "ignore"], encoding: "utf-8" }).trim();
}

/**
 * @param {string} target
 */
export function changelogHead(target) {
  return [
    "# Changelog",
    "",
    `All notable changes to \`@wjminis/${target}\` will be documented in this file.`,
    "",
    "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),",
    "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
    "",
    "## Unreleased",
    "",
    "Added:",
    "",
    "N/A",
    "",
    "Changed:",
    "",
    "N/A",
    "",
    "Deprecated:",
    "",
    "N/A",
    "",
    "Removed:",
    "",
    "N/A",
    "",
    "Fixed:",
    "",
    "N/A",
    "",
    "Security:",
    "",
    "N/A",
    "",
  ].join("\n");
}
