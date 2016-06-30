var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var include = require('gulp-include');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  console.log('-- gulp is running task \'scripts\'');
 
  gulp.src('src/*.js')
	.pipe(include())
	.pipe(gulp.dest('dist/'));
});

gulp.task('compress', function () {
	pump([
		gulp.src('dist/chartress.js'),
		uglify(),
		rename({
		  suffix: '.min'
		}),
		gulp.dest('dist'),
		livereload()
	]);
});

gulp.task('watch', function () {
	// Endless stream mode 
    // return watch('src/**/*.js', ['scripts', 'compress']);
    livereload.listen();
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build', ['scripts', 'compress']);
gulp.task('default', ['build', 'watch']);