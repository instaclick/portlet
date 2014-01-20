var static = require('node-static'),
	exec   = require('child_process').exec;

var fileServer = new static.Server('../');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(9000);

exec('open http://localhost:9000/test');