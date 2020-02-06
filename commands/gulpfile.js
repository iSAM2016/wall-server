const { src, dest, series, watch, parallel } = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');

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
  return src('src/**/*.ts')
    .pipe(
      ts({
        noImplicitAny: true,
      }),
    )
    .pipe(dest('dist'));
}

watch('./src/**/*.ts', series(TypeScript));

exports.default = series(parallel(TypeScript), nodemonWatch);
