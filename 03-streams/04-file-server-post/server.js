const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
  const sizeStream = new LimitSizeStream({limit: 1048576});

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested path are not supported');
      }

      req
          .on('aborted', () => {
            writeStream.destroy();
            sizeStream.destroy();
            fs.unlink(filepath, () => {});
          })
          .on('finish', () => {
            res.statusCode = 201;
            res.end('File was saved');
          })
          .pipe(sizeStream)
          .on('error', (error) => {
            if (error.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end('File exceeds the limit');
            } else {
              res.statusCode = 500;
              res.end('Internal server error');
            }
            writeStream.destroy();
            fs.unlink(filepath, () => {});
          })
          .pipe(writeStream)
          .on('error', (error) => {
            if (error.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('File already exists');
            } else {
              res.statusCode = 500;
              res.end('Internal server error');
            }
          });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
