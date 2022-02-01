const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.str = '';
    this.arrStr = '';
  }

  _transform(chunk, encoding, callback) {
    this.str += chunk;
    this.arrStr = this.str.split(os.EOL);
    this.str = this.arrStr.pop();
    callback(null, this.arrStr.shift());
    for (const item of this.arrStr) {
      this.push(item);
    }
  }

  _flush(callback) {
    callback(null, this.str);
  }
}

module.exports = LineSplitStream;
