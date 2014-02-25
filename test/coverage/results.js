var page = require('webpage').create();
var url  = 'http://localhost:3637/test/specRunner.html#lcov';
var fs   = require('fs');

// for debug (to see if page returns status code 200)
page.onResourceReceived = function(response) {
    if (response.url === url) {
        console.log('Resorce: "' + response.url + '" status: '  + response.status);

        if (response.status === 200) {
            console.log(response.url);
            for (var i = 0; i < response.headers.length; i++) {
                console.log(response.headers[i].name + ': ' + response.headers[i].value);
            }
        }
    }
};

page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onLoadFinished = function(status){
    console.log('Status: ' + status);

    page.evaluateAsync(function () {
        document.addEventListener('coverage.ready', function () {
            window.callPhantom(lcov);
        });
    });
};

page.onCallback = function (data) {
    try {
        fs.write('test/coverage/result.lcov', data);
    } catch(e) {
        console.log(e);
    }
    phantom.exit(0);
}

page.open(url);
