import rl from "node:readline";
import fs from "node:fs";
import path from "node:path";
import child from "node:child_process";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// get target directory
readline.question("Target directory: .../packages/", (target) => {
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
    console.log("Error: directory already exists");
    process.exit(1);
  }

  if (!/^[a-z]+(-[a-z]+)*(\.[a-z]+(-[a-z]+)*)*$/.test(target)) {
    console.log(
      "Error: invalid target name - must be all lowercase latin characters and hyphens, must not start or end with a hyphen, must not contain consecutive hyphens",
    );
    process.exit(1);
  }

  fs.mkdirSync(targetPath);

  fs.mkdirSync(path.join(targetPath, "src"));

  fs.writeFileSync(
    path.join(targetPath, "package.json"),
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
    "utf-8",
  );

  fs.writeFileSync(
    path.join(targetPath, "tsconfig.json"),
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
    "utf-8",
  );

  fs.writeFileSync(
    path.join(targetPath, ".prettierrc"),
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
    "utf-8",
  );

  fs.writeFileSync(
    path.join(targetPath, ".gitignore"),
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
    "utf-8",
  );

  fs.writeFileSync(path.join(targetPath, "src", "index.ts"), "export {};\n", "utf-8");

  fs.writeFileSync(
    path.join(targetPath, "README.md"),
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
    "utf-8",
  );

  fs.writeFileSync(
    path.join(targetPath, "LICENSE"),
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
    "utf-8",
  );

  child.execSync("pnpm install", { cwd, stdio: "inherit" });

  readline.close();
});
