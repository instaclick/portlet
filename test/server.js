var http  = require("http"),
    url   = require("url"),
    path  = require("path"),
    fs    = require("fs"),
    spawn = require('child_process').spawn,
    port  = process.argv[2] || 9000;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      switch (path.extname(filename)) {
        case '.html':
          response.writeHead(200, {"Content-Type": "text/html"});
        break;
        case '.js':
          response.writeHead(200, {"Content-Type": "application/javascript"});
        break;
        default:
          response.writeHead(200);
        break;
      }

      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

spawn('open', ['http://localhost:' + port + '/test']);
