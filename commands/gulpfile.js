const { src, dest, series, watch, parallel } = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const tsProject = ts.createProject('tsconfig.json');

function nodemonWatch(cb) {
  var started = false;
  return nodemon({
    script: 'dist/index.js',
    ext: 'js html',
    exec: 'node --inspect', // debuge
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
}

function TypeScript() {
  return gulp
    .src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(dest('dist'));
}

watch('./src/**/*.ts', series(TypeScript));

exports.default = series(parallel(TypeScript), nodemonWatch);
