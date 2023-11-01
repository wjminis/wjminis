import rl from "node:readline";
import fs from "node:fs";
import path from "node:path";
import child from "node:child_process";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const doGit = !process.argv.includes("--no-git");

readline.question("Package: @wjminis/", (target) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const cwd = path.join(__dirname, "..");
  const targetPath = path.join(cwd, "packages", target);

  if (path.dirname(targetPath) !== path.join(cwd, "packages")) {
    console.log(
      "Error: cannot nest packages - try flat--nesting with dots `.` instead of slashes `/`",
    );
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.log(`WARN: Package already exists: @wjminis/${target}`);
    console.log(
      "WARN: Continuing will rewrite immutable files:",
      Object.keys(immutables)
        .map((file) => `\n- ./${path.join("packages", file)}`)
        .join(""),
    );
    readline.question("Would you like to rewrite immutable files? [y/N] ", (answer) => {
      if (answer.toLowerCase() === "y") writeAll(immutables, target, targetPath);
      readline.close();
    });
    return;
  }

  if (!/^[a-z]+(-[a-z]+)*(\.[a-z]+(-[a-z]+)*)*$/.test(target)) {
    console.log(
      "Error: invalid target name - must be all lowercase latin characters and hyphens, " +
        "must not start or end with a hyphen, must not contain consecutive hyphens",
    );
    process.exit(1);
  }

  fs.mkdirSync(targetPath);
  fs.mkdirSync(path.join(targetPath, "src"));

  writeAll(mutables, target, targetPath);
  writeAll(immutables, target, targetPath);

  child.execSync("pnpm install", { cwd, stdio: "inherit" });
  if (doGit) {
    child.execSync(`git add ${targetPath}`, { cwd, stdio: "inherit" });
    child.execSync(`git add ${path.join(cwd, "pnpm-lock.yaml")}`, { cwd, stdio: "inherit" });
    child.execSync(`git commit -m ":tada: Create @wjminis/${target}"`, { cwd, stdio: "inherit" });
  }

  readline.close();
});

/**
 * @param {Record<string, (target: string) => string>} map
 * @param {string} target
 * @param {string} targetPath
 */
function writeAll(map, target, targetPath) {
  for (const file in map) fs.writeFileSync(path.join(targetPath, file), map[file](target), "utf-8");
}

/**@type {Record<string, (target: string) => string>}*/
const immutables = {
  "tsconfig.json": (target) =>
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2019",
          module: "ES2022",
          allowJs: false,
          strict: true,
          alwaysStrict: true,
          rootDir: "src",
          outDir: "dist",
          declaration: true,
          sourceMap: true,
          declarationMap: true,
          esModuleInterop: true,
          newLine: "lf",
        },
      },
      null,
      2,
    ) + "\n",
  ".prettierrc": (target) =>
    JSON.stringify(
      {
        arrowParens: "always",
        bracketSameLine: false,
        bracketSpacing: true,
        editorconfig: false,
        embeddedLanguageFormatting: "auto",
        endOfLine: "lf",
        htmlWhitespaceSensitivity: "css",
        insertPragma: false,
        jsxSingleQuote: false,
        printWidth: 100,
        proseWrap: "preserve",
        quoteProps: "as-needed",
        requirePragma: false,
        semi: true,
        singleAttributePerLine: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "all",
        useTabs: false,
      },
      null,
      2,
    ) + "\n",
  ".gitignore": (target) =>
    [
      "node_modules",
      ".DS_Store",
      "dist",
      "*.pem",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".env",
      ".env.local",
      ".env.development.local",
      ".env.test.local",
      ".env.production.local",
      ".turbo",
      "",
    ].join("\n"),
  LICENSE: (target) =>
    [
      `    @wjminis/${target}`,
      `    Copyright (C) ${new Date().getFullYear()}-Present Will 'WillsterJohnson' Johnson <willster+wjminis@willsterjohnson.com>`,
      "",
      "    This program is free software: you can redistribute it and/or modify",
      "    it under the terms of the GNU General Public License as published by",
      "    the Free Software Foundation, either version 3 of the License, or",
      "    (at your option) any later version.",
      "",
      "    This program is distributed in the hope that it will be useful,",
      "    but WITHOUT ANY WARRANTY; without even the implied warranty of",
      "    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the",
      "    GNU General Public License for more details.",
      "",
      "    You should have received a copy of the GNU General Public License",
      "    along with this program.  If not, see <https://www.gnu.org/licenses/>.",
      "",
    ].join("\n"),
};

/**@type {Record<string, (target: string) => string>}*/
const mutables = {
  "README.md": (target) =>
    [
      `# @wjminis/${target}`,
      "",
      "## Install",
      "",
      "```sh",
      `pnpm add @wjminis/${target}`,
      "```",
      "",
      "<!-- content here -->",
      "",
      "## License",
      "",
      `\`@wjminis/${target}\` is free and open-source software licensed under the`,
      "[GPL-3.0 License](./LICENSE).",
      "",
    ].join("\n"),
  [path.join("src", "index.ts")]: () => "export {};\n",
  "package.json": (target) =>
    JSON.stringify(
      {
        name: `@wjminis/${target}`,
        version: "0.1.0",
        type: "module",
        license: "GPL-3.0",
        description: "",
        keywords: [],
        scripts: {
          build: "tsc",
          lint: 'prettier --check "src/**/*.ts"',
        },
        exports: {
          ".": {
            default: "./dist/index.js",
            types: "./dist/index.d.ts",
          },
        },
        devDependencies: {
          prettier: "latest",
          typescript: "latest",
        },
      },
      null,
      2,
    ) + "\n",
};
