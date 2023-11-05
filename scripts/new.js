import fs from "node:fs";
import path from "node:path";
import { changelogHead, clear, cwd, dim, input, red, sh, yellow } from "./funcs.js";

/**
 * @typedef {Record<string, (target: string) => string>} FileMap
 */
/**
 * @param {string[]} targets
 * @param {string} message
 */
async function commit(targets, message) {
  const answer = await input(`Commit the new & changed files? ${dim("[y/N]")}${clear} `);
  if (answer.toLowerCase() === "y") {
    sh("git reset");
    for (const file of targets) sh(`git add ${file}`);
    sh(`git diff-index --quiet HEAD || git commit -m "${message}"`);
  }
}

/**
 * @param {FileMap} map
 * @param {string} target
 * @param {string} targetPath
 */
function writeAll(map, target, targetPath) {
  for (const file in map)
    fs.writeFileSync(path.join(targetPath, file), map[file](target) + "\n", "utf-8");
}

/**
 * @param {string} alt
 * @param {string} endpoint
 * @param {string} logo
 */
function shield(alt, endpoint, logo) {
  return `![${alt}](https://img.shields.io/${endpoint}?color=444&label=&logo=${logo})`;
  // https://img.shields.io/endpoint?url=https%3A%2F%2Fwjminis.dev
}

/**
 * @param {string} rootDir
 * @param {string} target
 * @param {FileMap} immutables
 * @param {string} errExists
 */
async function validateTarget(rootDir, target, immutables, errExists) {
  if (
    path.dirname(rootDir) !== path.join(cwd, "packages") &&
    path.dirname(rootDir) !== path.join(cwd, "apps")
  ) {
    console.log(
      red("ERR:"),
      clear,
      "nesting is not allowed! Try flat-nesting with dots `.` instead of slashes `/`",
    );
    process.exit(1);
  }

  if (fs.existsSync(rootDir)) {
    console.log(yellow("WARN:"), clear, errExists);
    console.log(
      yellow("WARN:"),
      clear,
      "Continuing will rewrite immutable files:",
      Object.keys(immutables)
        .map((file) => `\n\t- ./${path.join("packages", file)}`)
        .join(""),
    );

    const answer = await input(
      `Would you like to rewrite immutable files? ${dim("[y/N]")}${clear} `,
    );
    if (answer.toLowerCase() === "y") {
      writeAll(immutables, target, rootDir);
      commit(
        Object.keys(immutables).map((file) => path.join(rootDir, file)),
        `:sparkles: Rewrite immutables`,
      );
    }
    return;
  }

  // a letter, any combination of letters and hyphens. Repeat 1 or more times, separated by dots (period/full-stop)
  if (!/^[a-z]+(-[a-z]+)*(\.[a-z]+(-[a-z]+)*)*$/.test(target)) {
    console.log(
      red("ERR:"),
      clear,
      "invalid target name - must be all lowercase latin characters and hyphens, " +
        "must not start or end with a hyphen, must not contain consecutive hyphens",
    );
    process.exit(1);
  }
}

/**
 * @param {string} rootDir
 * @param {string} target
 * @param {FileMap} files
 * @param {string[]} folders
 * @param {Record<string, string>} links
 */
function build(rootDir, target, files, folders, links = {}) {
  fs.mkdirSync(rootDir);
  for (const subdir of folders.sort((a, b) => a.length - b.length))
    fs.mkdirSync(path.join(rootDir, subdir));
  for (const link in links) fs.symlinkSync(links[link], path.join(rootDir, link));
  writeAll(files, target, rootDir);
  sh("pnpm install");
}

async function pkg() {
  /**@type {FileMap}*/
  const immutables = {
    "tsconfig.json": () =>
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
      ),
    ".prettierrc": () =>
      JSON.stringify(
        {
          arrowParens: "always",
          bracketSameLine: false,
          bracketSpacing: true,
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
      ),
    ".gitignore": () =>
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
        "!.npmignore",
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
      ].join("\n"),
    ".npmignore": () => ["**/*", "!dist/**/*", "!CHANGELOG.md"].join("\n"),
  };
  /**@type {FileMap}*/
  const mutables = {
    "README.md": (target) =>
      [
        `# @wjminis/${target}`,
        "",
        [["NPM Version", `npm/v/@wjminis/${target}`, "npm"]].map(([alt, endpoint, logo]) =>
          shield(alt, endpoint, logo),
        ),
        "",
        ,
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
      ].join("\n"),
    [path.join("src", "index.ts")]: () => "export {};",
    "package.json": (target) =>
      JSON.stringify(
        {
          name: `@wjminis/${target}`,
          version: "0.1.0",
          type: "module",
          license: "GPL-3.0",
          description: "",
          keywords: ["wjminis", target, ...(target.includes(".") ? target.split(".") : [])],
          scripts: {
            build: "tsc",
            lint: 'prettier --check "src/**/*.ts"',
          },
          exports: {
            ".": "./dist/index.js",
          },
          devDependencies: {
            prettier: "latest",
            typescript: "latest",
          },
          repository: {
            type: "git",
            url: "https://github.com/wjminis/wjminis.git",
          },
          homepage: "https://github.com/wjminis/wjminis",
          bugs: {
            url: "https://github.com/wjminis/wjminis/issues",
            email: "willster+wjminis@willsterjohnson.com",
          },
        },
        null,
        2,
      ),
    "CHANGELOG.md": changelogHead,
  };

  const subdirectories = ["src"];

  const target = await input(`Package: ${dim("@wjminis/")}${clear}`);
  const rootDir = path.join(cwd, "packages", target);

  validateTarget(rootDir, target, immutables, `Package already exists: @wjminis/${target}`);

  build(rootDir, target, { ...mutables, ...immutables }, subdirectories);

  commit([rootDir, path.join(cwd, "pnpm-lock.yaml")], `:tada: Create @wjminis/${target}`);
}

async function app() {
  /**@type {FileMap}*/
  const immutables = {
    ".gitignore": () =>
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
        "!.npmignore",
      ].join("\n"),
    ".prettierrc": () =>
      JSON.stringify(
        {
          arrowParens: "always",
          bracketSameLine: false,
          bracketSpacing: true,
          embeddedLanguageFormatting: "auto",
          endOfLine: "lf",
          htmlWhitespaceSensitivity: "css",
          insertPragma: false,
          jsxSingleQuote: false,
          printWidth: 100,
          plugins: ["prettier-plugin-svelte"],
          pluginSearchDirs: ["."],
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
      ),
    "error.html": () =>
      [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "  <head>",
        '    <meta charset="utf-8" />',
        "    <link",
        '      rel="icon"',
        '      href="%sveltekit.assets%/favicon.png"',
        "    />",
        "    <meta",
        '      name="viewport"',
        '      content="width=device-width, initial-scale=1"',
        "    />",
        "    <title>%sveltekit.status% | WJMinis</title>",
        "  </head>",
        '  <body data-sveltekit-preload-data="hover">',
        "    <span",
        '      style="display: none"',
        '      id="data-status"',
        "      >%sveltekit.status%</span",
        "    >",
        "    <span",
        '      style="display: none"',
        '      id="data-message"',
        "      >%sveltekit.error.message%</span",
        "    >",
        "    <h1>%sveltekit.status% %sveltekit.error.message%</h1>",
        "    <p>Something went wrong! Here's how to get back to what you were doing:</p>",
        "    <ol>",
        "      <li>",
        "        <details>",
        "          <summary>Try refreshing the page</summary>",
        "          <p>This could be a one-time thing, refreshing the page could fix everything.</p>",
        "        </details>",
        "      </li>",
        "      <li>",
        "        <details>",
        "          <summary>Try going back a page</summary>",
        "          <p>There's a litte left-pointing arrow in the top left, give it a click.</p>",
        "        </details>",
        "      </li>",
        "      <li>",
        "        <details>",
        '          <summary>Try going to the <a href="/">home page</a>.</summary>',
        "          <p>",
        "            It could be the state of the app at this page is broken, going home will reset this.",
        "          </p>",
        "        </details>",
        "      </li>",
        "      <li>",
        "        <details>",
        "          <summary>",
        "            Send this error report in an",
        "            <a",
        '              id="email-link"',
        '              href="mailto:willster+wjminis@willsterjohnson.com"',
        "              >email</a",
        "            >.",
        "          </summary>",
        "          <p>",
        "            Clicking the link above should fill out the email automatically, if not here's the",
        "            template;",
        "          </p>",
        "          <div>",
        '            <p>To: <span id="email-to"></span></p>',
        '            <p>Subject: <span id="email-subject"></span></p>',
        "            <p>Body:</p>",
        '            <span id="email-body"></span>',
        "          </div>",
        "        </details>",
        "      </li>",
        "    </ol>",
        "    <script>",
        '      window.addEventListener("load", () => {',
        '        const status = document.getElementById("data-status").innerText;',
        '        const message = document.getElementById("data-message").innerText;',
        '        const emailLink = document.getElementById("email-link");',
        '        const emailTo = document.getElementById("email-to");',
        '        const emailSubject = document.getElementById("email-subject");',
        '        const emailBody = document.getElementById("email-body");',
        "",
        "        const generatedSubject = `Error report for ${window.location.hostname} ${status} ${message}`;",
        "",
        "        const generatedBody = [",
        "          `To the Webmaster,`,",
        '          "",',
        "          `At ${new Date().toLocaleString()}, the following error occured:`,",
        '          "",',
        "          `Domain: ${window.location.hostname}`,",
        "          `Path: ${window.location.pathname}`,",
        "          `Status: ${status}`,",
        "          `Message: ${message}`,",
        '          "",',
        '          "I confirm that refreshing, going back a page, and going to the home page did not resolve the issue.",',
        '          "",',
        '          "[ENTER ADDITIONAL INFORMATION HERE]",',
        '          "",',
        '          "Get it fixed!",',
        '          "Many thanks,",',
        '          "A user",',
        '        ].join("\n");',
        "",
        '        const recipient = "willster+wjminis@willsterjohnson.com";',
        "",
        "        emailLink.href = `mailto:${recipient}?subject=${encodeURIComponent(",
        "          generatedSubject",
        "        )}&body=${encodeURIComponent(generatedBody)}`;",
        "        emailTo.innerText = recipient;",
        "        emailSubject.innerText = generatedSubject;",
        "        emailBody.innerText = generatedBody;",
        "      });",
        "    </script>",
        "  </body>",
        "</html>",
      ].join("\n"),
    "index.html": () =>
      [
        "<!doctype html>",
        '<html lang="en">',
        "  <head>",
        '    <meta charset="utf-8" />',
        "    <link",
        '      rel="icon"',
        '      href="%sveltekit.assets%/favicon.png"',
        "    />",
        "    <meta",
        '      name="viewport"',
        '      content="width=device-width, initial-scale=1"',
        "    />",
        "      <link",
        '        rel="stylesheet"',
        '        href="%sveltekit.assets%/global.css"',
        "      />",
        "    %sveltekit.head%",
        "  </head>",
        '  <body data-sveltekit-preload-data="hover">',
        '    <div style="display: contents">%sveltekit.body%</div>',
        "    <script>",
        '      window.addEventListener("load", () => {',
        "        if (window.location.hostname === 'localhost') return;",
        `        if (window.location.hostname !== "${target
          .split(".")
          .reverse()
          .join(".")}.wjminis.dev") {`,
        '          window.alert("Invalid hostname");',
        '          throw new Error("Invalid hostname");',
        "        }",
        "      });",
        "    </script>",
        "  </body>",
        "</html>",
      ].join("\n"),
    LICENSE: (target) =>
      [
        `    ${target}.wjminis.dev`,
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
      ].join("\n"),
    "tsconfig.json": () =>
      JSON.stringify(
        {
          extends: "./dist/tsconfig.json",
          compilerOptions: {
            allowJs: true,
            checkJs: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            skipLibCheck: true,
            sourceMap: true,
            strict: true,
          },
        },
        null,
        2,
      ),
    [path.join("routes", "status", "+server.ts")]: () =>
      [
        'import type { RequestHandler } from "./$types";',
        "",
        "export const GET: RequestHandler = () => {",
        '  return new Response(\'{ "schemaVersion": 1, "label": "", "message": "live", "color": "000" }\');',
        "};",
      ].join("\n"),
  };
  /**@type {FileMap}*/
  const mutables = {
    "package.json": (target) =>
      JSON.stringify(
        {
          name: `dev.wjutils.${target}`,
          type: "module",
          private: true,
          scripts: {
            prepare: "svelte-kit sync",
            dev: "../__BUILDSPACE__/run-script dev",
            build: "../__BUILDSPACE__/run-script build",
            preview: "../__BUILDSPACE__/run-script preview",
            lint: 'prettier --plugin-search-dir . --check "{assets,hooks,lib,routes}/**/*.{js,ts,svelte,json,css,html}" "{index,error}.html" "app.d.ts"',
          },
          devDependencies: {
            "@sveltejs/kit": "^1.20.4",
            prettier: "^2.8.0",
            "prettier-plugin-svelte": "^2.10.1",
            svelte: "^4.0.5",
            tslib: "^2.4.1",
            typescript: "^5.0.0",
          },
        },
        null,
        2,
      ),
    "app.d.ts": () =>
      [
        "// See https://kit.svelte.dev/docs/types#app",
        "// for information about these interfaces",
        "declare global {",
        "  namespace App {",
        "    interface Error {",
        "      message: string;",
        "      id: string;",
        "    }",
        "    // interface Locals {}",
        "    // interface PageData {}",
        "    // interface Platform {}",
        "  }",
        "}",
        "",
        "export {};",
      ].join("\n"),
    "README.md": (target) =>
      [
        `# [${target}.wjminis.dev](https://${target}.wjminis.dev)`,
        "",
        "## License",
        "",
        `[${target}.wjminis.dev] is free and open-source software licensed under the`,
        "[GPL-3.0 License](./LICENSE).",
        "",
        `[${target}.wjminis.dev]: https://${target}.wjminis.dev`,
      ].join("\n"),
    [path.join("hooks", "client.ts")]: () =>
      [
        'import type {  HandleClientError } from "@sveltejs/kit";',
        "",
        "export const handleError: HandleClientError = async ({ error, event }) => {",
        "  const id = crypto.randomUUID();",
        '  return { id, message: "Error" };',
        "};",
      ].join("\n"),
    [path.join("hooks", "server.ts")]: () =>
      [
        'import type { Handle, HandleServerError } from "@sveltejs/kit";',
        "",
        "export const handle: Handle = async ({ event, resolve }) => {",
        "  const response = await resolve(event);",
        "  return response;",
        "};",
        "",
        "export const handleError: HandleServerError = async ({ error, event }) => {",
        "  const id = crypto.randomUUID();",
        '  return { id, message: "Error" };',
        "};",
      ].join("\n"),
    [path.join("routes", "+page.svelte")]: (target) => `<h1>Welcome to ${target}.wjminis.dev</h1>`,
  };

  const subdirectories = ["assets", "hooks", "lib", "routes", path.join("routes", "status")];

  const links = {
    "lib.universal": path.join(cwd, "apps", "__BUILDSPACE__", "lib"),
    params: path.join(cwd, "apps", "__BUILDSPACE__", "params"),
    [path.join("assets", "universal.css")]: path.join(
      cwd,
      "apps",
      "__BUILDSPACE__",
      "universal.css",
    ),
  };

  const target = await input(`App: ${dim("dev.wjminis.")}${clear}`);
  const rootDir = path.join(cwd, "apps", target);

  validateTarget(rootDir, target, immutables, `App already exists: dev.wjminis.${target}`);

  build(rootDir, target, { ...mutables, ...immutables }, subdirectories, links);

  commit([rootDir, path.join(cwd, "pnpm-lock.yaml")], `:tada: Create dev.wjminis.${target}`);
}

const kind = process.argv[2];

if (kind === "package") pkg();
else if (kind === "app") app();
else console.log(`Error: unknown kind: ${kind} - expected \`package\` or \`app\``);
