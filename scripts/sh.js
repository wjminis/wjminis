import path from "node:path";
import child from "node:child_process";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const cwd = path.join(__dirname, "..");

/**
 * @param {string} cmd
 */
export function sh(cmd) {
  return child.execSync(cmd, { cwd, encoding: "utf-8" });
}
