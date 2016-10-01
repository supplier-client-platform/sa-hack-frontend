var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    jshint = require('gulp-jshint'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    environments = require('gulp-environments'),
    del = require('del'),
    imagemin   = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    jsonminify = require('gulp-json-minify'),
    vendorJson = require('./vendor.json');

var prod = environments.make('prod');
var staging = environments.make('staging');
var qa = environments.make('qa');
var hotFix = environments.make('hotFix');
var dev = environments.make('dev');

//Asserts js
gulp.task('asserts_js', function(){
    /** load config file based on environment */
    var configFile = null;

    if (prod()) {
        configFile = './env/prod.js';
    } else if (staging()) {
        configFile = './env/staging.js';
    } else if (qa()) {
        configFile = './env/qa.js';
    } else if (hotFix()) {
        configFile = './env/hotFix.js';
    } else {
        configFile = './env/dev.js';
    }

    gulp.src(configFile)
        .pipe(uglify())
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream());

    return gulp.src([
            //node module js
            './node_modules/moment/min/moment.min.js',
            './node_modules/video.js/dist/video.min.js',
            './node_modules/vjs-video/dist/vjs-video.min.js',
            './node_modules/underscore/underscore-min.js',
            './node_modules/angular-material-datetimepicker/js/angular-material-datetimepicker.min.js',

            //assert js
            './src/assets/js/*.js'
        ])
        .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js'))
        .pipe(browserSync.stream());
});

//Asserts scss
gulp.task('asserts_scss', function() {
    gulp.src('./src/assets/scss/styles.scss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        //.pipe(autoprefixer())
        .pipe(gulp.dest('./src/assets/css/'));
});

//Images
gulp.task('image', function() {
    gulp.src('./src/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/images'));
});

//Fonts
gulp.task('fonts', function() {
    gulp.src([
            './src/assets/fonts/**/**.*'
        ])
        .pipe(gulp.dest('./build/assets/fonts'))
        .pipe(browserSync.stream());
});

//App js
gulp.task('app_js', function() {
    // Grabs the app.js file
    var bundleStream = browserify({
            entries: ['./src/app/app.js'],
            debug: !(prod() || staging() || qa())
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer());

    if (prod() || staging() || qa()) {
        bundleStream.pipe(uglify({ mangle: false }));
    }

    bundleStream.pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream());
});

//Vendor js
gulp.task('vendor_js', function() {
    // Grabs the app.js file
    browserify({
        entries: ['./src/app/vendor.js']
    })
    .bundle()
    .pipe(source('vendor.min.js'))
    .pipe(buffer())
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

//Html
gulp.task('html', function() {
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({
            removeComments: true,
            processConditionalComments: true
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

//Css
gulp.task('css', ['vendor_css', 'asserts_scss'], function() {
    gulp.src('./src/assets/css/*.css')
        .pipe(concatCss('app.min.css'))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('vendor_css', ['copy_vendor'], function() {
    gulp.src(vendorJson.css, {base: 'build/assets/css'})
        .pipe(concatCss('vendor.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('copy_json', function(){
    gulp.src('./src/translations/*.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('./build/translations'));
});

//Copy only filtered files that required for css
gulp.task('copy_vendor', function(){

});

//browser-sync
gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: './build',
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
});

//Lint
gulp.task('lint', function() {
    return gulp.src('./src/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

//Clean
gulp.task('clean', function(){
    del('build/*');
});

//Build
gulp.task('build', [
    'lint',
    'asserts_js',
    'image',
    'fonts',
    'vendor_js',
    'app_js',
    'html',
    'css',
    'copy_json'
],function () {
    if (prod()) {
        console.log('Build as Production')
    } else if (staging()) {
        console.log('Build as Staging')
    } else if (qa()) {
        console.log('Build as QA')
    } else if (hotFix()) {
        console.log('Build as Hot fix')
    } else {
        console.log('Build as Dev')
    }
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch('./src/assets/**/*.js', ['asserts_js']);
    gulp.watch(['./src/assets/scss/*.scss', './src/assets/scss/**/*.scss'], ['css']);
    gulp.watch(['./src/app/*.js', './src/app/**/*.js'], ['app_js']);
    gulp.watch('./src/**/*.html', ['html']);
});
