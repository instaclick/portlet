portlet
=======
[![Build Status](https://secure.travis-ci.org/instaclick/portlet.png)](http://travis-ci.org/instaclick/portlet)
[![Coverage Status](https://coveralls.io/repos/instaclick/portlet/badge.png)](https://coveralls.io/r/instaclick/portlet)

Client-side support for [Portlet](http://en.wikipedia.org/wiki/Portlet)

## Contribute

Be sure to have node.js 0.10.x

Install bower, testem and grunt globally (may require root privileges)
```CLI
$ npm install -g bower testem grunt-cli
```

Install internal dependencies
```CLI
$ cd portlet
$ npm install
$ bower install
```

Run test server
```CLI
$ testem
```

Run headless test
```CLI
$ testem ci --launch <browser_name>
```

Lint code
```CLI
$ grunt jshint
```

Generate minified version
```CLI
$ grunt requirejs
```
