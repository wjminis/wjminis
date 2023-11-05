import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    lightningcss: {
      targets: {
        chrome: 80,
        firefox: 80,
      },
      drafts: {
        nesting: true,
      },
    },
  },
});
