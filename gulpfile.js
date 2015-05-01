var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var inline = require('gulp-mc-inline-css');
var browserSync = require('browser-sync');
var inlinesource = require('gulp-inline-source');
var sendmail = require('gulp-mailgun');
var util = require('gulp-util');
var fs = require('fs');

// Include the config
var config = require('./config.json');

// Compile Our Sass
gulp.task('css', function() {
  return gulp.src('src/scss/*.scss')
  .pipe(sass({errLogToConsole: true}))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream:true}));
});

// BrowserSync
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './dist',
      index: 'index.html'
    },
    open: "external",
    logPrefix: "Gulp Email Creator"
  });
});

// Build our templates
gulp.task('build', function() {
  return gulp.src('src/html/*.html')
    .pipe(inlinesource())
    .pipe(inline(config.mailchimp.api_key))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream:true}));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/html/*.html', ['build']);
  gulp.watch('src/css/*.css', ['build']);
});

gulp.task('send', function () {
  gulp.src( 'dist/' + util.env.template)
  .pipe(sendmail({
    key: config.mailgun.api_key,
    sender: config.mailgun.sender,
    recipient: config.mailgun.recipient,
    subject: 'This is a test email'
  }));
});

// Default Task
gulp.task('default', ['css', 'server', 'build', 'watch']);

gulp.task('litmus', function () {
    return sendEmail(util.env.template, config.litmus);
});
