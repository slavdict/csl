// Rollup plugins
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
//import builtins from 'rollup-plugin-node-builtins';
//import globals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy-glob';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

const IS_PRODUCTION = process.env.CSL_ENV === 'production',
      CSL_VERSION = require('./package.json').version;

console.log('\nCSL v' + CSL_VERSION);

export default {
  external: ['jquery', 'knockout'],
  input: 'src/app.js',
  output: {
    file: 'build/js/spa.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      'jquery': 'jQuery',
      'knockout': 'ko',
    },
  },
  plugins: [
    postcss({
      extensions: ['.css'],
      plugins: [
        simplevars(),
        nested(),
        cssnext(),
        cssnano(),
      ],
    }),
    //builtins(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    //globals(),
    eslint({
      exclude: [
        'src/styles/**',
      ],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: [
        'node_modules/**',
      ],
      CSL_ENV: JSON.stringify(process.env.CSL_ENV || 'development'),
    }),
    IS_PRODUCTION && terser(),
    copy([
      { files: 'src/index.html', dest: 'build' },
      { files: 'src/icons/*', dest: 'build' },
      { files: 'robots.txt', dest: 'build' },
    ], {
      verbose: IS_PRODUCTION,
      watch: false
    }),
  ],
};
