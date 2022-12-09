const through2 = require('through2');
const log = require('fancy-log');

function defaultErrorHandler(error) {
  log(`Unhandled error:\n ${error.toString()}`)
  if (this && this.emit) {
    this.emit('end');
  }
}

module.exports = function() {
  const through = through2.obj();
  let errorHandler = defaultErrorHandler;

  if (typeof arguments[0] === 'function') {
    errorHandler = arguments[0];
  }

  const patchPipe = stream => {
    stream._pipe = stream._pipe || stream.pipe;
    stream.pipe = stream.patchedPipe;
  }

  through.patchedPipe = function patchedPipe(dest) {
    this._pipe.apply(this, arguments);
    dest.patchedPipe = patchedPipe;
    patchPipe(dest);
    dest.on('error', errorHandler.bind(dest));
    return dest;
  }

  patchPipe(through);

  return through;
}