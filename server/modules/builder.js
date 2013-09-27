var fs = require('fs');
var fsExtra = require('fs-extra');
var sass = require('node-sass');
var _ = require('underscore');

/**
 * File types
 * @const {RegExp}
 */
var RE_CSS = /\.css$/;
var RE_JS = /\.js$/;
var RE_SCSS = /\.scss$/;
var RE_SPEC = /\.spec\.js$/;
var RE_HTML = /\.html$/;
var RE_VENDOR = /\/vendor\//;

/**
 * Clear path recursively
 * @param {string} path Path
 */
function clear(path) {
  if (fs.existsSync(path)) {
    fsExtra.removeSync(path);
  }
}

/**
 * Create CSS files
 * @param {string} publicPath Public absolute path
 * @param {Array.<string>} paths Client file paths
 */
function createCss(publicPath, paths) {
  _(paths).each(function(path) {
    if (RE_SCSS.test(path)) {
      // compile css
      var css = sass.renderSync({
        data: fs.readFileSync(path, ENCODING),
        includePaths: [
          publicPath
        ]
      });

      // create css file
      var cssPath = path.replace(RE_SCSS, '.css');
      fs.writeFileSync(cssPath, css, ENCODING);
    }
  });
}

/**
 * Create index.html file
 * @param {string} publicPath Public absolute path
 * @param {Array.<string>} paths Client file paths
 */
function createHtml(publicPath, paths) {
  var cssPaths = [];
  var jsPaths = [];

  var vendorPaths = [];

  var vendorConfig = module.exports.config('vendor');

  _(vendorConfig.vendor).each(function(lib) {
    if (!vendorConfig[lib]) {
      throw new Error('Library \'' + lib + '\' not exists in config');
    }

    _(vendorConfig[lib]).each(function(relativePath) {
      var path = publicPath + 'vendor/' + lib + '/' + relativePath;

      if (!fs.existsSync(path)) {
        throw new Error('Vendor file \'' + relativePath + '\' not found');
      }

      vendorPaths.push(path);
    });
  });

  _(vendorPaths.concat(paths)).each(function(path) {
    if (RE_CSS.test(path)) {
      cssPaths.push(path);
    }

    if (RE_JS.test(path) && !RE_SPEC.test(path)) {
      jsPaths.push(path);
    }
  });

  var templatePath = publicPath + 'app/app.html';

  if (!fs.existsSync(templatePath)) {
    throw new Error('Template \'app/app.html\' is required');
  }

  var template = fs.readFileSync(templatePath, ENCODING);

  // compile html
  var html = _(template).template({
    css: getWebPaths(publicPath, cssPaths),
    js: getWebPaths(publicPath, jsPaths)
  });
  // create index.html file
  fs.writeFileSync(publicPath + 'index.html', html, ENCODING);
}

/**
 * Get Web paths of files
 * @param {string} publicPath Public absolute path
 * @param {Array.<string>} paths Client file paths
 * @returns {Array.<string>} Web paths
 */
function getWebPaths(publicPath, paths) {
  var webPaths = [];

  var re = new RegExp('^' + _(publicPath).escapeRegExp());

  _(paths).each(function(path) {
    webPaths.push(path.replace(re, '/'));
  });

  return webPaths;
}

/**
 * Copy libs
 * @param {Array.<string>} libs
 * @param {function()=} opt_callback
 */
function copyVendor(libs, opt_callback) {
  var lib = libs.shift();

  var path;

  if (fs.existsSync(PATH.APP.VENDOR + lib + '/')) {
    path = PATH.APP.VENDOR + lib + '/';
  } else if (fs.existsSync(PATH.FAF.VENDOR + lib + '/')) {
    path = PATH.FAF.VENDOR + lib + '/';
  } else {
    throw new Error('Library \'' + lib + '\' not found');
  }

  fsExtra.copy(path, PATH.APP.BUILD + 'vendor/' + lib + '/', function(err) {
    if (err) {
      throw new Error(err);
    }

    if (libs.length > 0) {
      copyVendor(libs, opt_callback);
    } else if (opt_callback) {
      opt_callback.call(this);
    }
  });
}

module.exports = {
  /**
   * Build project
   * @param {function()=} opt_callback Callback
   */
  build: function(opt_callback) {
    var callback = function() {
      var scanner = this.module('scanner');
      var vendorFilter = function(path) {
        return !RE_VENDOR.test(path);
      };

      var paths = scanner.scan(PATH.APP.BUILD, vendorFilter);
      createCss(PATH.APP.BUILD, paths);

      paths = scanner.scan(PATH.APP.BUILD, vendorFilter);
      createHtml(PATH.APP.BUILD, paths);

      if (opt_callback) {
        opt_callback.call(this);
      }
    }.bind(this);

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

        var libs = [];
        this.config('vendor').vendor.forEach(function(lib) {
          libs.push(lib);
        });

        if (libs.length > 0) {
          fs.mkdirSync(PATH.APP.BUILD + 'vendor/');
          copyVendor(libs, callback);
        } else {
          callback.call(this);
        }
      }.bind(this));
    }.bind(this));
  },

  /**
   * Compile project
   * @param {function()=} opt_callback Callback
   * @todo Implement
   */
  compile: function(opt_callback) {}
};
