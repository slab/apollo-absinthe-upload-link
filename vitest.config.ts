import { defineConfig } from 'vitest/config'

export default defineConfig({
  // build: {
  //   outDir: "lib",
  //   lib: {
  //     name: "apollo-absinthe-upload-link",
  //     entry: "./src/index.ts",
  //     formats: ["es"]
  //   },
  //   sourcemap: true,
  //   rollupOptions: {
  //     // make sure to externalize deps that shouldn't be bundled
  //     // into your library
  //     // external: ['graphql', '@apollo/client/core'],
  //     output: {
  //       preserveModules: true
  //     }
  //   },
  // },
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"]
  }
});
