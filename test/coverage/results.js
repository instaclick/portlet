var page = require('webpage').create();
var url  = 'http://localhost:3637/test/specRunner.html#lcov';

// page.onConsoleMessage = function (msg) {
//     console.log(msg);
// };

page.onLoadFinished = function(status){
    page.evaluateAsync(function () {
        document.addEventListener('coverage.ready', function () {
            window.callPhantom(lcov);
        });
    });
};

page.onCallback = function (data) {
    try {
        console.log(data);
    } catch(e) {
        console.log(e);
    }
    phantom.exit(0);
}

page.open(url);
