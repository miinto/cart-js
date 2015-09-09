var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var watchify   = require('watchify');
var uglify     = require('gulp-uglify');
var babel      = require('babelify');

function compile(watch)
{
	var bundler = watchify(browserify('./src/main.js', {debug: true}).transform(babel));

	function rebundle()
	{
		bundler.bundle()
			.on('error', function(err)
			{
				console.error(err);
				this.emit('end');
			})
			.pipe(source('cart-bundle.js'))
			.pipe(buffer())
//			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
//			.pipe(sourcemaps.write('./'))
//			.pipe(gulp.dest('./build'));
			.pipe(gulp.dest('../miinto_com/static/scripts/cartjs'));
	}

	if (watch) {
		bundler.on('update', function()
		{
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

function watch()
{
	return compile(true);
};

gulp.task('build', function()
{
	return compile();
});
gulp.task('watch', function()
{
	return watch();
});

gulp.task('default', ['watch']);