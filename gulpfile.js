const { src, dest, task, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss' )
const cssComb = require('gulp-csscomb' )
const autoprefixer = require('autoprefixer' );
const mqpacker = require('css-mqpacker' );
const sortCSSmq = require('sort-css-media-queries' );

const PATH = {
  scssRoot: "./assets/scss/style.scss",
  scssFiles: "./assets/scss/**/*.scss",
  scssFolder: "./assets/scss",
  htmlFiles: "./*.html",
  jsFiles: "./assets/js/*.js",
  cssFolder: "./assets/css",
};

const PLUGINS = [autoprefixer({
  overrideBrowserlist: ['last 5 versions', ' > 2%'],
  cascade: sortCSSmq
}),
  mqpacker({
    sort: true
  })
]

function scss() {
  return src(PATH.scssRoot)
    .pipe(sass().on("error", sass.logError))
    .pipe(cssComb())
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream())
}


function scssDev() {
  const pluginsForDevMode = [...PLUGINS]
  pluginsForDevMode.splice(0,1)
  return src(PATH.scssRoot, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(pluginsForDevMode))
    .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
    .pipe(browserSync.stream())
}

function scssMin() {
  const pluginsForMininified = [...PLUGINS, cssnano( { preset: 'default' })]
  return src(PATH.scssRoot)
    .pipe(sass().on("error", sass.logError))
    .pipe(cssComb())
    .pipe(postcss(pluginsForMininified))
    .pipe(rename({ suffix: 'min' }))
    .pipe(dest(PATH.cssFolder))
}

function comb() {
  return src(PATH.scssFiles)
    .pipe(csscomb())
    .pipe(dest(PATH.scssFolder))
}

function syncInit() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

async function reload() {
  browserSync.reload()
}

function watchFiles() {
  syncInit();
  watch(PATH.htmlFiles, reload);
  watch(PATH.jsFiles, reload)
  watch(PATH.scssFiles, series(scss, scssMin));
}

task("scss", series(scss, scssMin));
task("dev", scssDev);
task("min", scssMin);
task("watch", watchFiles);
task("comb", comb)

// const { task, series, parallel, src, dest, watch } = require("gulp");
// const sass = require("gulp-sass")(require("sass"));
// const browserSync = require("browser-sync").create();

// const cssnano = require('cssnano')
// const rename = require('gulp-rename')
// const postcss = require('gulp-postcss' )
// const autoprefixer = require('autoprefixer' );
// const mqpacker = require('css-mqpacker' )
// const sortCSSmq = require('sort-css-media-queries' )
// const PLUGINS = [
//   autoprefixer({
//     overrideBrowserslist : ['last 5 versions' , '> 1%'],
//     cascade: true
//   }),
//   mqpacker({ sort: sortCSSmq })
// ];
// const csscomb = require('gulp-csscomb' )
// const pug = require('gulp-pug')

// function compilePug() {
// return src(PATH.pugRootFile)
// .pipe(pug({ pretty: true }))
// .pipe(dest(PATH.pugFolder))
// }

// src('src-path', {sourcemaps: true})
// .pipe(dest('dest-path', {sourcemaps: true}))
// .pipe(dest('dest-path', {sourcemaps: '.'}))

// function scssDev() {
//   return src('./assets/scss/style.scss' , { sourcemaps: true })
//   .pipe(sass().on('error', sass.logError))
//   .pipe(dest('./assets/css' , { sourcemaps: true }))
//   .pipe(browserSync.reload({ stream: true }))
//   }

// function scss() {
//   return src('./assets/scss/style.scss' )
//   .pipe(sass().on('error', sass.logError))
//   .pipe(dest('./assets/css' ))
//   .pipe(browserSync.stream())
//   .pipe(postcss(PLUGINS))
// }

// function comb() {
//   return src('./assets/scss/**/*.scss' )
//   .pipe(csscomb('./.csscomb.json' ))
//   .pipe(dest('./assets/scss' ))
//   }

// function scssMin() {
//   const pluginsExtended = PLUGINS.concat([cssnano({
//     preset: 'default'
//     })]);
//   return src('./assets/scss/style.scss' )
//   .pipe(sass().on('error', sass.logError))
//   .pipe(postcss(pluginsExtended))
//   .pipe(rename({ suffix: '.min' }))
//   .pipe(dest('./assets/css' ))
//   }

// function syncInit() {
//   browserSync.init({
//     server: {
//       baseDir: "./",
//     },
//   });
// }

// async function sync() {
//   browserSync.reload();
// }

// function watchFiles() {
//   syncInit();
//   watch("./assets/scss/**/*.scss", scss);
//   watch("./*.html", sync);
//   watch("./assets/js/**/*.js", sync);
// }

// task("watch", watchFiles);
// task("scss", scss);
// task('min', scssMin)
// task('comb', comb)
