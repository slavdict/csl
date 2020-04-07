const CSL_ENV = process.env.CSL_ENV || 'development',
      CSL_ENV_IS_PRODUCTION = process.env.CSL_ENV === 'production',
      CSL_VERSION = require('./package.json').version;

const nunjucksContext = {
  CSL_IDN: 'церковнославянский.онлайн',
  CSL_IDN_PUNYCODE: 'xn--80adbjsgcdgtdgcxue6e3i.xn--80asehdb',
  CSL_IDN_REDIRECT: 'csl.ruslang.ru',
  CSL_NAME: 'Церковнославянский язык сегодня',
  CSL_SHORT_NAME: 'Цсл язык сегодня',
  CSL_VERY_SHORT_NAME: 'Цсл сегодня',
  CSL_DESCRIPTION: '',
  CSL_SHORT_DESCRIPTION: 'Просветительский портал о церковнославянском языке.',
  CSL_VERSION: CSL_VERSION,
  CSL_ENV: CSL_ENV,
  CSL_ENV_IS_PRODUCTION: CSL_ENV_IS_PRODUCTION,

  urls: {
    dictionary: '/словарь',
    entries: '/словарь/статьи',
    index: '/словарь/индекс',
    about: '/словарь/описание',
    video: '/видео',
    refs: '/ссылки',
    authors: '/авторы',
  }
};

const { src, dest, parallel, series } = require('gulp'),
      merge = require('merge-stream');

// Gulp plugins
const babel = require('gulp-babel'),
      eslint = require('gulp-eslint'),
      ext = require('gulp-ext'),
      gulpif = require('gulp-if'),
      htmlmin = require('gulp-htmlmin'),
      markdown = require('gulp-markdown'),
      nunjucks = require('gulp-nunjucks'),
      postcss = require('gulp-postcss'),
      rename = require('gulp-rename'),
      rollup = require('gulp-better-rollup'),
      terser = require('gulp-terser');

// Rollup plugins
const //builtins = require('rollup-plugin-node-builtins'),
      commonjs = require('rollup-plugin-commonjs'),
      //globals = require('rollup-plugin-node-globals'),
      jscc = require('rollup-plugin-jscc'),
      resolve = require('rollup-plugin-node-resolve');

// PostCSS plugins
const calc = require('postcss-calc'),
      cssNano = require('cssnano'),
      cssPresetEnv = require('postcss-preset-env'),
      customProps = require('postcss-css-variables'),
      easyImport = require('postcss-easy-import'),
      mixins = require('postcss-mixins'),
      sassLikeVars = require('postcss-simple-vars');

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
    resolve({ mainFields: ['browser', 'jsnext:main', 'module', 'main'] }),
    commonjs(),
    //globals(),
    jscc({ values: { _CONFIG: nunjucksContext }, exclude: 'node_modules/**'}),
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
    .pipe(eslint())
    .pipe(babel({ exclude: 'node_modules/**' }))
    .pipe(gulpif(CSL_ENV_IS_PRODUCTION, terser()))
    .pipe(dest('.build/js', { sourcemaps: true }));
}

function css() {
  var cpOpts = { preserve: false },
      cpeOpts = { stage: 0 },
      plugins = [easyImport(), mixins(), sassLikeVars(), customProps(cpOpts),
                 cssPresetEnv(cpeOpts), calc(), cssNano()];
  return src('src/styles/main.css').pipe(postcss(plugins))
    .pipe(rename('csl.css')).pipe(dest('.build'));
}

function assets() {
  return merge(
    src('src/icons/*').pipe(dest('.build')),
    src('src/fonts/*').pipe(dest('.build/fonts')),
    src('src/images/*').pipe(dest('.build/img')),
    src('node_modules/jquery/dist/jquery.min.js').pipe(dest('.build/js')),
    src('node_modules/lite-youtube-embed/src/lite-yt-embed.js')
      .pipe(dest('.build/js')),
    src('node_modules/knockout/build/output/knockout-latest.js')
      .pipe(rename('knockout.min.js')).pipe(dest('.build/js')),
    src('src/scraps/about.htm').pipe(dest('.build')),
    src('src/scraps/authors.htm').pipe(dest('.build')),
    src('src/scraps/refs.md').pipe(markdown()).pipe(rename('refs.htm'))
      .pipe(dest('.build')),
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
