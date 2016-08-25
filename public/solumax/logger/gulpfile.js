var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {

	gulp.src([
		'**/*.js',
		'!gulpfile.js',
		'!logger.js',
		])
		.pipe(concat('logger.js'))
		.pipe(gulp.dest(''));
});