const path = require('path')
const fs = require('fs-extra');
const {build} = require('esbuild');

const serverDir = path.join(__dirname, "..");
async function bundleServer() {
  const result = await build({
    outfile: path.join(serverDir,'export.js'),
    // eslint-disable-next-line no-undef
    absWorkingDir: process.cwd(),
    entryPoints: [path.join(serverDir, "./src/cli/index.ts")],
    write: false,
    platform: "node",
    bundle: true,
    format: "esm",
    sourcemap: false,
    treeShaking: true,
    banner: {
      js: `/* eslint-disable prettier/prettier */`,
    },
    // eslint-disable-next-line no-undef
    tsconfig: path.resolve(__dirname, "./tsconfig.bundleServer.json"),
    plugins: [
      {
        name: "externalize-deps",
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path;
            if (id[0] !== "." && !path.isAbsolute(id)) {
              return {
                external: true,
              };
            }
          });
        },
      },
    ],
  });
  const { text } = result.outputFiles[0];
  const forceProduction = `process.env.NODE_ENV = 'production';\n`;
  const filePath = path.join(serverDir, "./dist/server/index.js");
  if (fs.existsSync(filePath)) {
    await fs.remove(filePath);
  }
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, forceProduction + text);
}

bundleServer();
