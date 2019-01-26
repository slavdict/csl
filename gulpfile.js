const exec = require('child_process').exec,
    { src, dest, parallel, series } = require('gulp'),
      merge = require('merge-stream');

// Gulp plugins
const ext = require('gulp-ext'),
      gulpif = require('gulp-if'),
      htmlmin = require('gulp-htmlmin'),
      nunjucks = require('gulp-nunjucks'),
      postcss = require('gulp-postcss'),
      rename = require('gulp-rename'),
      rollup = require('gulp-better-rollup');

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
const calc = require('postcss-calc'),
      cssNano = require('cssnano'),
      cssPresetEnv = require('postcss-preset-env'),
      customProps = require('postcss-css-variables'),
      easyImport = require('postcss-easy-import'),
      mixins = require('postcss-mixins'),
      sassLikeVars = require('postcss-simple-vars');

const CSL_ENV = process.env.CSL_ENV || 'development',
      CSL_ENV_IS_PRODUCTION = process.env.CSL_ENV === 'production',
      CSL_VERSION = require('./package.json').version;

const nunjucksContext = {
  CSL_NAME: 'Церковнославянский язык сегодня',
  CSL_SHORT_NAME: 'Цсл язык сегодня',
  CSL_VERY_SHORT_NAME: 'Цсл сегодня',
  CSL_DESCRIPTION: 'Перед вами пилотная версия популяризаторского портала, работа над которым еще только начинается. Пока что посетителям доступны видеолекции по истории церковнославянского языка и книжности. В ближайшее время появится электронная версия Большого словаря церковнославянского языка Нового времени. Чуть позже — греко-славянский индекс и аннотированный путеводитель по ресурсам Интернета, связанным с церковнославянским языком.',
  CSL_DOMAIN_NAME: 'csl.ruslang.ru',
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
    eslint(),
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
    .pipe(dest('.build'));
}

function js() {
  return src('src/app.js', { sourcemaps: true })
    .pipe(rollup(rollupInputOpts, rollupOutputOpts))
    .pipe(dest('.build/js', { sourcemaps: true }));
}

function css() {
  var cpOpts = { preserve: false },
      cpeOpts = { stage: 0 },
      plugins = [easyImport(), mixins(), sassLikeVars(), customProps(cpOpts),
                 calc(), cssPresetEnv(cpeOpts), cssNano()];
  return src('src/styles/main.css').pipe(postcss(plugins))
    .pipe(rename('csl.css')).pipe(dest('.build'));
}

function assets() {
  return merge(
    src('src/icons/*').pipe(dest('.build')),
    src('src/fonts/*').pipe(dest('.build/fonts')),
    src('src/images/*').pipe(dest('.build/img')),
    src('node_modules/jquery/dist/jquery.min.js').pipe(dest('.build/js')),
    src('node_modules/knockout/build/output/knockout-latest.js')
      .pipe(rename('knockout.min.js')).pipe(dest('.build/js')),
    src('robots.txt').pipe(dest('.build'))
  );
}

function sync() {
  return merge(
    src('.build/*').pipe(dest('build')),
    src('.build/img/*').pipe(dest('build/img')),
    src('.build/fonts/*').pipe(dest('build/fonts')),
    src('.build/js/*').pipe(dest('build/js'))
  );
}

exports.html = series(html, sync);
exports.js = series(js, sync);
exports.css = series(css, sync);
exports.assets = series(assets, sync);
exports.sync = sync;
exports.default = series(parallel(css, js, assets, html), sync);
