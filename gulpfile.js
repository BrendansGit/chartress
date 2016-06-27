var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var include = require('gulp-include');
var rename = require('gulp-rename');
 
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
	]);
});

gulp.task('default', ['scripts', 'compress']);