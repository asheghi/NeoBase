const path = require('path')
const {build} = require('esbuild');
const {nodeExternalsPlugin} = require("./nodeExternalsPlugin.cjs");

const serverDir = path.join(__dirname, "..");
let outfile = path.join(serverDir,'dist/index.js');
let entryPoint = path.join(serverDir, "./src/cli/index.ts");
let tsconfig = path.resolve(__dirname, "../tsconfig.json");

console.time('EsBuild');
console.log('EsBuild: Building...')
build({
    outfile,
    absWorkingDir: process.cwd(),
    entryPoints: [entryPoint],
    treeShaking: true,
    tsconfig,
    plugins: [
      nodeExternalsPlugin,
    ],
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
  })
    .then(() => {
      console.timeEnd('EsBuild')
      console.log('EsBuild finished successfully!')
    })
    .catch((e) => {
      console.error('EsBuild Failed');
      console.error(e);
      process.exit(1);
    })



