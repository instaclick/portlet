var page = require('webpage').create();
var url  = 'http://localhost:3637/test/specRunner.html#lcov';
var fs   = require('fs');
var cwd  = require('system').args[1] + '/';

// page.onConsoleMessage = function (msg) {
//     console.log(msg);
// };

page.onLoadFinished = function(status){
    page.evaluateAsync(function () {
        document.addEventListener('coverage.ready', function () {
            window.callPhantom(_$blanket_LCOV);
        });
    });
};

page.onCallback = function (data) {
    try {
        data = data.replace(/\.\.\//g, cwd);
        console.log(data);
        fs.write(cwd + 'test/coverage/result.info', data);
    } catch(e) {
        console.log(e);
    }
    phantom.exit(0);
}

page.open(url);
