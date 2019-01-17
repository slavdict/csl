const exec = require('child_process').exec,
    { src, dest, parallel } = require('gulp'),
      rollup = require('gulp-better-rollup'),
      rename = require('gulp-rename'),
      ext = require('gulp-ext'),
      gulpif = require('gulp-if'),
      htmlmin = require('gulp-htmlmin'),
      postcss = require('gulp-postcss'),
      nunjucks = require('gulp-nunjucks');

// Rollup plugins
const babel = require('rollup-plugin-babel'),
      eslint = require('rollup-plugin-eslint').eslint,
      resolve = require('rollup-plugin-node-resolve'),
      //builtins = require('rollup-plugin-node-builtins'),
      //globals = require('rollup-plugin-node-globals'),
      commonjs = require('rollup-plugin-commonjs'),
      replace = require('rollup-plugin-replace'),
      terser = require('rollup-plugin-terser').terser;

// PostCSS plugins
const easyimport = require('postcss-easy-import'),
      simplevars = require('postcss-simple-vars'),
      nested = require('postcss-nested'),
      cssnext = require('postcss-cssnext'),
      cssnano = require('cssnano');

const CSL_ENV = process.env.CSL_ENV || 'development',
      CSL_ENV_IS_PRODUCTION = process.env.CSL_ENV === 'production',
      CSL_VERSION = require('./package.json').version;

const nunjucksContext = {
  CSL_NAME: 'Церковнославянский язык сегодня',
  CSL_SHORT_NAME: 'Цсл язык сегодня',
  CSL_VERY_SHORT_NAME: 'Цсл сегодня',
  CSL_DESCRIPTION: 'Поверение ничто ино есть, токмо свидетельство сложения, аще истинно сложил без погрешения, или в чем погрешил: а поверяется сице: из всех верхних перечней порядком вычитай по 9. Оставшее же напиши особно. А по том вычти из исподняго перечня по 9 же: и что останется, того смотри, аще толикое же число осталось, елико и от верхних оставшее, и особно написанное. И по тому знай, яко право, и без погрешения сложен перечень. Аще же не будет согласен остаток, с первым остатком, убо не добре сложил еси.',
  CSL_VERSION: CSL_VERSION,
  CSL_ENV: CSL_ENV,
  CSL_ENV_IS_PRODUCTION: CSL_ENV_IS_PRODUCTION
};

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
    //builtins(),
    resolve({ jsnext: true, main: true, browser: true, }),
    commonjs(),
    //globals(),
    eslint({ exclude: ['src/styles/**'] }),
    babel({ exclude: 'node_modules/**', }),
    replace(Object.assign(nunjucksContext, { exclude: ['node_modules/**'] })),
    CSL_ENV_IS_PRODUCTION && terser(),
  ],
};

console.log('\nCSL v' + CSL_VERSION);

function html() {
  var cond = function (vinylFile) { return vinylFile.path.endsWith('.html'); };
  return src(['src/index.html.njk', 'src/csl.webmanifest.njk'])
    .pipe(nunjucks.compile(nunjucksContext))
    .pipe(ext.crop())
    .pipe(gulpif(cond, htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeComments: true,
      ignoreCustomComments: [/^\s+ko\s+|\s+\/ko\s+$/],
      minifyCSS: true,
      minifyJS: true,
    })))
    .pipe(dest('build'));
}

function js() {
  return src('src/app.js', { sourcemaps: true })
    .pipe(rollup(rollupInputOpts, rollupOutputOpts))
    .pipe(dest('build/js', { sourcemaps: true }));
}

function css() {
  var plugins = [easyimport(), simplevars(), nested(), cssnext(), cssnano()];
  return src('src/styles/main.css').pipe(postcss(plugins))
    .pipe(rename('csl.css')).pipe(dest('build'));
}

function etc(callback) {
  src('src/icons/*').pipe(dest('build'));
  src('src/fonts/*').pipe(dest('build/fonts'));
  src('src/images/*').pipe(dest('build/img'));
  src('node_modules/jquery/dist/jquery.min.js').pipe(dest('build/js'));
  src('node_modules/knockout/build/output/knockout-latest.js')
    .pipe(rename('knockout.min.js')).pipe(dest('build/js'));
  return src('robots.txt').pipe(dest('build'));
}

exports.html = html;
exports.js = js;
exports.css = css;
exports.etc = etc;
exports.default = parallel(html, css, js, etc);
