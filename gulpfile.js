const exec = require('child_process').exec,
    { src, dest, parallel } = require('gulp'),
      rollup = require('gulp-better-rollup'),
      rename = require('gulp-rename'),
      nunjucks = require('gulp-nunjucks');

// Rollup plugins
const babel = require('rollup-plugin-babel'),
      eslint = require('rollup-plugin-eslint').eslint,
      resolve = require('rollup-plugin-node-resolve'),
      //builtins = require('rollup-plugin-node-builtins'),
      //globals = require('rollup-plugin-node-globals'),
      commonjs = require('rollup-plugin-commonjs'),
      replace = require('rollup-plugin-replace'),
      terser = require('rollup-plugin-terser').terser,
      postcss = require('rollup-plugin-postcss');

// PostCSS plugins
const easyimport = require('postcss-easy-import'),
      simplevars = require('postcss-simple-vars'),
      nested = require('postcss-nested'),
      cssnext = require('postcss-cssnext'),
      cssnano = require('cssnano');

const IS_PRODUCTION = process.env.CSL_ENV === 'production',
      CSL_VERSION = require('./package.json').version;

const rollupOutputOpts = {
  file: 'spa.js',
  format: 'iife',
  globals: {
    'jquery': 'jQuery',
    'knockout': 'ko',
  }
};

const rollupInputOpts = {
  external: ['jquery', 'knockout'],
  plugins: [
    postcss({
      extensions: ['.css'],
      plugins: [
        easyimport(),
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
  ],
};

console.log('\nCSL v' + CSL_VERSION);

function html() {
  return src('src/index.njk')
    .pipe(nunjucks.compile())
    .pipe(rename('index.html'))
    .pipe(dest('build'));
}

function js() {
  return src('src/app.js', { sourcemaps: true })
    .pipe(rollup(rollupInputOpts, rollupOutputOpts))
    .pipe(dest('build/js', { sourcemaps: true }));
}

function etc(callback) {
  src('src/icons/*').pipe(dest('build'));
  src('src/fonts/*').pipe(dest('build/fonts'));
  src('src/styles/fonts.css').pipe(dest('build'));
  src('robots.txt').pipe(dest('build'));
}

exports.html = html;
exports.js = js;
exports.etc = etc;
exports.default = parallel(html, js, etc);
