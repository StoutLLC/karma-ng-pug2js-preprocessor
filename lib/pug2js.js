var util = require('util');
var pug = require('pug');

var TEMPLATE = 'angular.module(\'%s\', []).run([\'$templateCache\', function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '}]);\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module(\'%s\');\n' +
    '} catch (e) {\n' +
    '  module = angular.module(\'%s\', []);\n' +
    '}\n' +
    'module.run([\'$templateCache\', function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '}]);\n' +
    '})();\n';

var escapeContent = function(content) {
  return content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
};

var createPug2JsPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.pug2js');
  var moduleName = config.moduleName;
  var locals = config.locals;
  var templateExtension = config.templateExtension || 'html';
  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var pugOptions = config.pugOptions || {};
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix +
      filepath
        .replace(stripPrefix, '')
        .replace(/\.pug$/, '.' + templateExtension);
  };

  return function(content, file, done) {
    var processed;

    log.debug('Processing "%s".', file.originalPath);

    pugOptions.filename = file.originalPath;

    try {
       processed = pug.compile(content, pugOptions);
    } catch (e) {
     log.error('%s\n  at %s', e.message, file.originalPath);
     return;
    }

    content = processed(locals);

    var htmlPath = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));

    file.path = file.path.replace(/\.pug$/, '.html') + '.js';

    if (moduleName) {
      done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, htmlPath, escapeContent(content)));
    } else {
      done(util.format(TEMPLATE, htmlPath, htmlPath, escapeContent(content)));
    }
  };
};

createPug2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngPug2JsPreprocessor'];

module.exports = createPug2JsPreprocessor;
