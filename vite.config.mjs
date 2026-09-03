import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/aws-amplify") ||
            id.includes("node_modules/@aws-sdk") ||
            id.includes("node_modules/@smithy")
          ) {
            return "aws";
          }
          if (id.includes("node_modules/@mui") || id.includes("node_modules/@emotion")) {
            return "ui";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "react";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
