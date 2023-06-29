// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

const config = {
  entries: [
    {
      filePath: "./src/index.ts",
      outFile: `./dist/index.d.ts`,
      noCheck: false,
    },
  ],
};

module.exports = config;
