const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpConcat = require('gulp-concat');
const gulpUglify = require('gulp-uglify');
const gulpMiniimg = require('gulp-imagemin');
const gulpRename = require('gulp-rename');

gulp.task('compressimg', function() {
	gulp.src('./images/*.jpg')
		.pipe(gulpMiniimg({
			progressive: true
		}))
		.pipe(gulp.dest('./images/'));
});
	
gulp.src(['./libs/gif.js', './showcase.js'])
		.pipe(gulpConcat('showcase.js'))
		.pipe(gulpBabel({
			presets: ['env']
		}))
		.pipe(gulpUglify())
		.pipe(gulpRename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['compressimg', 'babel']);
