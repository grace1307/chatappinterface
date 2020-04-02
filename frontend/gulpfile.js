const gulp = require('gulp')
const sass = require('gulp-sass')
const livereload = require('gulp-livereload')

const publicFiles = [
  './src/modules/*.*',
  './src/views/*.*',
  './src/index.html'
]

const devPublicFiles = [
  './src/modules/*.*',
  './src/views/*.*',
  './src/dev.html'
]

gulp.task('build', () => {
  return gulp.src('./src/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/styles'))
})

gulp.task('assets', gulp.series('build', () => {
  return gulp
    .src('./assets/*.*', { base: './' })
    .pipe(gulp.dest('./public'))
}))

gulp.task('devdeploy', gulp.series('assets', () => {
  return gulp
    .src(devPublicFiles, { base: './src' })
    .pipe(gulp.dest('./public'))
    .pipe(livereload())
}))

gulp.task('dev', gulp.series('devdeploy', () => {
  livereload.listen()
  gulp.watch('./src/**/*.*', gulp.series('devdeploy'))
}))

gulp.task('deploy', gulp.series('assets', () => {
  return gulp
    .src(publicFiles, { base: './src' })
    .pipe(gulp.dest('./public'))
}))
