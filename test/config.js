(function (window, requirejs, require, mocha, blanket) {
  'use strict';

  mocha.setup('bdd');

  if (window.location.hash === '#lcov') {
    blanket.options("reporter", "../vendor/lcov_reporter.js");
    blanket.options("reporter_options", {
      toHTML: false
    });

    blanket._onTestsDone = blanket.onTestsDone;
    blanket.onTestsDone = function () {
      var phantomMessageCallback = document.createEvent("Events");

      blanket._onTestsDone.apply(this, arguments);
      phantomMessageCallback.initEvent('coverage.ready', true, true);
      document.dispatchEvent(phantomMessageCallback);
    }
  }

  window.reloadFixtures = function(handler, uri) {
    uri = uri || 'fixtures/fixtures.html';

    $('#fixtures').load(uri, handler);
  }

  requirejs.config({
    baseUrl: '../',
    paths: {
      jquery: 'vendor/bower_components/jquery/dist/jquery',
      'jquery.cloneEvent': 'vendor/bower_components/jquery.cloneEvent/jquery.cloneEvent',
      Portlet: 'src',
      Bisna: 'vendor/bisna',
      Specs: 'test/specs',
      Chai: 'node_modules/chai/chai',
      Testem: '/testem'
    },
    shim: {
      'jquery.cloneEvent': {
        deps: ['jquery']
      },
      'jquery.eventEmitter': {
        deps: ['jquery']
      }
    }
  });

  var specList = [
        'Specs/Portlet.spec',
        'Specs/Manager.spec',
        'Specs/Factory.spec',
        'Specs/Form.spec'
      ],
      deps = [
        'jquery',
        'Chai'
      ];

  if (window.location.hash !== '#lcov') {
    deps.push('Testem');
  }

  require(deps.concat(specList), function ($, Chai) {
    window.expect = Chai.expect;
    window.setTimeout(mocha.run, 2000);
  });

}(window, window.requirejs, window.require, window.mocha, window.blanket));
