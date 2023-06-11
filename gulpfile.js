const {src, dest, watch, parallel, series } = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const del           = require('del');
const browserSync   = require('browser-sync').create();
const svgSprite     = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttf2woff2');

function convertFonts() {
    return src('app/fonts/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));
}

function svgSprites() {
    return src('app/images/sprite-icons/*.svg')
    .pipe(
        svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                },
            },
        })
    )
    .pipe(dest('app/images'));
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notofy: false
    })
}

function styles() {
    return src('app/scss/style.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

// function scripts() {
//     return src([
//         'node_modules/jquery/dist/jquery.js',
//         'app/js/main.js'
//     ])
//     .pipe(concat('main.min.js'))
//     .pipe(uglify())
//     .pipe(dest('app/js'))
//     .pipe(browserSync.stream());
// }

// function images(){
//     return src('app/images/**/*.*')
//     .pipe(imagemin([imagemin.gifsicle({interlaced: true}),
//         imagemin.mozjpeg({quality: 75, progressive: true}),
//         imagemin.optipng({optimizationLevel: 5}),
//         imagemin.svgo({
//             plugins: [
//                 {removeViewBox: true},
//                 {cleanupIDs: false}
//             ]
//         })]))
//     .pipe(dest('dist/images'))
// }

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function cleanDist(){
    return del('dist')

}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/images/sprite-icons/*.svg'], svgSprite);
    watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.browsersync = browsersync;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.svgSprite = svgSprite;
exports.convertFonts = convertFonts;
// exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, browsersync, watching, svgSprites);
