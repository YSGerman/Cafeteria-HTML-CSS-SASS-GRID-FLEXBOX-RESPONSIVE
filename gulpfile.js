const { src, dest, watch, series, parallel } = require("gulp");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// IMAGENES
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  // compilar sass
  // paso 1 identificar archivo
  // paso 2 compilarlo
  // paso 3 guardar el .css

  src("src/scss/app.scss") /* paso 1 */
    .pipe(sourcemaps.init())
    .pipe(sass()) /* paso 2 */
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); /* paso 3 */

  done();
}

function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

function versionwebp() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
}

function versionavif() {
  const opciones = {
    quality: 50,
  };
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
  // watch('src/scss/app.scss', css);
  watch("src/img/**.*", imagenes);
}

// series - se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - todas inicial al mismo tiempo
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionwebp = versionwebp;
exports.versionavif = versionavif;

exports.default = series(imagenes, versionwebp, versionavif, css, dev);
