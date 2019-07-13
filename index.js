const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  DATA_URL = process.env.DATA_URL || 'http://www.mocky.io/v2/5ba8efb23100007200c2750c',
  port = process.env.PORT || 8125;

http.createServer(function (request, response) {
  var filePath = '.' + request.url;
  console.log(`[${new Date().toISOString()}] Request to fetch resource - ${filePath}`);
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  if(filePath.includes('favicon')) {
    //ignore favicon call
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end('', 'utf-8');
  }
  else if(filePath.includes('fetch-data')) {
    http.get(DATA_URL, resp => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(data, 'utf-8');
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
  else {
    fs.readFile(filePath, function(error, content) {
      if (error) {
        console.log('Failed to read file '+ error);
      }
      else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  }
}).listen(port);
console.log('Server Up and Running on PORT '+ port);