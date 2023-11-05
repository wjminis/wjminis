import path from "node:path";
import child from "node:child_process";
import rl from "node:readline";

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
  ].join("\n");
}

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export function input(prompt) {
  const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    readline.question(prompt, (answer) => {
      readline.close();
      resolve(answer);
    }),
  );
}

export const red = (str) => `\x1b[31m${str}`;
export const yellow = (str) => `\x1b[33m${str}`;
export const green = (str) => `\x1b[32m${str}`;
export const blue = (str) => `\x1b[34m${str}`;
export const cyan = (str) => `\x1b[36m${str}`;
export const magenta = (str) => `\x1b[35m${str}`;
export const dim = (str) => `\x1b[2m${str}`;
export const clear = "\x1b[0m";
