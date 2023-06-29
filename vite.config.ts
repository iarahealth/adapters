/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

const fileName = {
  es: 'index.js',
  cjs: 'index.cjs',
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'index',
      formats,
      fileName: (format) => fileName[format],
    },
  },
  test: {

  }
});
