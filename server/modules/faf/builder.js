var fs = require('fs');
var fsExtra = require('fs-extra');
var sass = require('node-sass');
var _ = require('underscore');

var RE_CSS = /\.css$/;
var RE_JS = /\.js$/;
var RE_SCSS = /\.scss$/;
var RE_SPEC = /\.spec\.js$/;
var RE_TPL = /\.tpl\.html$/;
var RE_VENDOR = /\/vendor\//;

function clear(path) {
  if (fs.existsSync(path)) {
    fsExtra.removeSync(path);
  }
}

function createCss(publicPath, paths) {
  var tags = [];

  _(paths).each(function(path) {
    if (RE_SCSS.test(path)) {
      var css = sass.renderSync({
        data: fs.readFileSync(path, ENCODING),
        includePaths: [
          publicPath
        ]
      });

      var cssPath = path.replace(RE_SCSS, '.css');
      fs.writeFileSync(cssPath, css, ENCODING);
    }
  });

  return tags;
}

function createHtml(publicPath, paths) {
  var cssPaths = [];
  var jsPaths = [];
  
  _(paths).each(function(path) {
    var method = RE_VENDOR.test(path) ? 'unshift' : 'push';

    if (RE_CSS.test(path)) {
      cssPaths[method](path);
    }

    if (RE_JS.test(path) && !RE_SPEC.test(path)) {
      jsPaths[method](path);
    }
  });

  var templatePath = publicPath + 'app/app.tpl.html';

  if (!fs.existsSync(templatePath)) {
    throw new Error('Template \'app/app.tpl.html\' is required');
  }

  var template = fs.readFileSync(templatePath, ENCODING);

  var html = _(template).template({
    css: getWebPaths(publicPath, cssPaths),
    js: getWebPaths(publicPath, jsPaths)
  });
  fs.writeFileSync(publicPath + 'index.html', html, ENCODING);
}

function getWebPaths(publicPath, paths) {
  var webPaths = [];

  var re = new RegExp('^' + _(publicPath).escapeRegExp());

  _(paths).each(function(path) {
    webPaths.push(path.replace(re, '/'));
  });

  return webPaths;
}

module.exports = {
  /**
   * Build project
   * @param {function()=} opt_callback Callback
   */
  build: function(opt_callback) {
    clear(PATH.APP.BUILD);

    // TODO sync
    fsExtra.copy(PATH.FAF.SRC, PATH.APP.BUILD, function(err) {
      if (err) {
        throw new Error(err);
      }

      fsExtra.copy(PATH.APP.SRC, PATH.APP.BUILD, function(err) {
        if (err) {
          throw new Error(err);
        }

        fsExtra.copy(PATH.FAF.VENDOR, PATH.APP.BUILD + 'vendor/', function(err) {
          if (err) {
            throw new Error(err);
          }

          fsExtra.copy(PATH.APP.VENDOR, PATH.APP.BUILD + 'vendor/', function(err) {
            if (err) {
              throw new Error(err);
            }

            var scanner = faf.module('faf.scanner');

            var paths = scanner.scan(PATH.APP.BUILD);
            createCss(PATH.APP.BUILD, paths);

            paths = scanner.scan(PATH.APP.BUILD);
            createHtml(PATH.APP.BUILD, paths);

            if (opt_callback) {
              opt_callback.call(this);
            }
          });
        });
      });
    });
  },

  /**
   * Compile project
   * @param {function()=} opt_callback Callback
   * @todo Implement
   */
  compile: function(opt_callback) {}
};
