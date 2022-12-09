Allows you to set single handler instead of appending .on('error', log) to each pipe.  
In contrary to ``gulp-plumber`` if error occures task will stop, it is, though do not means that your ``watch`` task will stop (see example).  

### How to use
```js
const errorHandler = require('gulp-error-handle');

gulp.task('build', function() {
  return gulp.src('styles/*.css')
    .pipe(errorHandler())
    .pipe(gulp.dest('build/'));
});
```
you can pass in ``function`` as well

```js
const logError = function(err) {
  gutil.log(err);
  this.emit('end');
};

gulp.task('build', function() {
  return gulp.src('styles/*.css')
    .pipe(errorHandler(logError))
    .pipe(gulp.dest('build/'));
});
```

**Note:** if you're passing your own function in, you need to emit ``'end'`` manually (if you're using plugin which already doing this, such as gulp-notify, you dont need to do this).


### Example

```js
const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const errorHandler = require('gulp-error-handle');

gulp.task('clean', () => del['build']);

gulp.task('css:build', ['clean'], function() {
  return gulp.src('styles/**/*.scss')
    .pipe(errorHandler())
    .pipe(sass())
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', () => {
  gulp.watch('styles/**/*.scss', ['css:build']);
});

gulp.task('default', ['clean', 'css:build', 'watch'])
```