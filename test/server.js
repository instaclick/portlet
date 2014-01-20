var stat       = require('node-static'),
	exec       = require('child_process').exec,
	fileServer = new stat.Server('../');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(9000);

exec('open http://localhost:9000/test');
