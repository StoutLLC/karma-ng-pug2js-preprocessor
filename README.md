# karma-ng-pug2js-preprocessor

> Preprocessor for converting Pug files to [AngularJS](http://angularjs.org/) templates.

Forked from [karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor)

## Installation

The easiest way is to keep `karma-ng-pug2js-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.12",
    "karma-ng-pug2js-preprocessor": "1.0.0-alpha"
  }
}
```

You can simple do it by:
```bash
npm install karma-ng-pug2js-preprocessor --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.pug': ['ng-pug2js']
    },

    files: [
      '*.js',
      '*.pug',
      // if you wanna load template files in nested directories, you must use this
      '**/*.pug'
    ],

    ngPug2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',

      // prepend this to the
      prependPrefix: 'served/',

      // By default, Pug files are added to template cache with '.html' extension.
      // Set this option to change it.
      templateExtension: 'html',

      // or define a custom transform function
      cacheIdFromPath: function(filepath) {
        return filepath.replace(/\.pug$/, '.html');
      },

      // Support for Pug locals to render at compile time
      locals: {
        foo: 'bar'
      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'foo',

      // Pug compiler options. For a list of possible options, consult Jade documentation.
      pugOptions: {
        doctype: 'xml'
      }
    }
  });
};
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
