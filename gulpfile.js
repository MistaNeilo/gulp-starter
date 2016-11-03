var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create();
    reload = browserSync.reload;
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util')


var paths = {
    bower: ['./bower_components/'],
    dist: './dist/',
    src: './src/'
};

gulp.task('sass', function() {
    return gulp.src(paths.src + 'sass/main.scss')
        .pipe(sass({
            style: 'compressed',
            loadPath: [
                paths.bower + 'bootstrap-sass/assets/stylesheets',
                paths.bower + 'animate.scss/scss',
                paths.bower + 'font-awesome/scss'
            ]
            })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dist + 'css/'))
        .pipe(reload({stream: true}));
});

gulp.task('copy-assets', function () {
    gulp.src([paths.bower + 'bootstrap-sass/assets/fonts/**/*{eot,svg,ttf,woff,woff2}', paths.bower + 'font-awesome/fonts/**/*{eot,otf,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest('./dist/fonts/'));

    gulp.src([paths.bower + 'bootstrap-sass/assets/javascripts/bootstrap.min.js', paths.bower + 'jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('./dist/js/vendor/'));
});

gulp.task('scripts', function () {

    // production version
    gulp.src([
            paths.src + 'vendor/jquery.min.js',
            paths.src + 'vendor/bootstrap.min.js',
            paths.src + 'custom.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('theme.min.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + 'js/'))
        .pipe(reload({stream: true}));

    // dev version 
    gulp.src([
            paths.src + 'vendor/jquery.min.js',
            paths.src + 'vendor/bootstrap.min.js',
            paths.src + 'custom.js'
        ])
        .pipe(concat('theme.js'))
        .pipe(gulp.dest(paths.dist + 'js/'))
        .pipe(reload({stream: true}));
});


gulp.task('build', ['copy-assets', 'sass', 'scripts']);

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'scripts'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch(paths.src + "sass/**/*.scss", ['sass']);
    gulp.watch(paths.src + "src/**/*.js", ['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});
