// vite.config.js
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "adapters",
      fileName: "adapters",
    },
    rollupOptions: {},
  },
  plugins: [
    libAssetsPlugin({
      include: /.json$/,
    }),
    dts({ rollupTypes: true }),
  ],
});
