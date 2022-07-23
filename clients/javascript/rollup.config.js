import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

function generateConfig(format, minify) {
  const nameFormat = format === 'umd' ? '' : `.${format}`;
  const nameMinfy = minify && format === 'umd' ? '.min' : '';
  const plugins = [commonjs({extensions:['.js']})];
  if (minify) {
    plugins.push(terser());
  }
  return {
    input: 'client.js',
    output: {
      file: `dist/client${nameFormat}${nameMinfy}.js`,
      name: 'Neobase',
      format,
    },
    plugins,
  };
}
module.exports = [
  // generateConfig('umd', true),
  generateConfig('umd', false),
  generateConfig('cjs', false),
  // generateConfig('esm', true),
  generateConfig('esm', false),
];
