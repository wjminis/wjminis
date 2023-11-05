import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";
import path from "node:path";

const root = process.env.__BUILDSPACE__;

const files = {
  appTemplate: path.join(root, "index.html"),
  assets: path.join(root, "assets"),
  errorTemplate: path.join(root, "error.html"),
  hooks: {
    client: path.join(root, "hooks", "client.ts"),
    server: path.join(root, "hooks", "server.ts"),
  },
  lib: path.join(root, "lib"),
  params: path.join(root, "params"),
  routes: path.join(root, "routes"),
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {},
  extensions: [".svelte"],
  package: {},
  vitePlugin: {},
  kit: {
    adapter: adapter(),
    alias: {
      $universal: "./lib",
      // $types: path.join(root, "dist", "types", path.basename(root)),
    },
    env: {
      dir: root,
    },
    files,
    moduleExtensions: [".ts"],
    outDir: path.join(root, "dist"),
    typescript: {
      config(config) {
        const indexOfTypes = config.include.findIndex((i) => i.startsWith("./types"));
        config.include[indexOfTypes] = `./types/${path.basename(root)}/**/$types.d.ts`;
        config.compilerOptions.rootDirs = ["../", `./types/${path.basename(root)}`];
      },
    },
  },
};

export default config;
