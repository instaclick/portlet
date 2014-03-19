portlet
=======
[![Build Status](https://secure.travis-ci.org/instaclick/portlet.png)](http://travis-ci.org/instaclick/portlet)
[![Coverage Status](https://coveralls.io/repos/instaclick/portlet/badge.png)](https://coveralls.io/r/instaclick/portlet)

Client-side support for [Portlet](http://en.wikipedia.org/wiki/Portlet)

```CLI
$ npm install instaclick/portlet
```

Then your portlet lib will be on
node_modules/portlet/dist/portlet.min.js

## Contribute

Be sure to have node.js 0.10.x

Install testem and grunt globally (may require root privileges)
```CLI
$ npm install -g testem grunt-cli
```

Install internal dependencies
```CLI
$ cd portlet
$ npm install
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

Release new version (create git tag and update package.json)
```CLI
$ grunt release
```
