var fs = require('fs');
var _ = require('underscore');

var globals = require('./globals');
require('./utils');

/**
 * Available Types of modules
 * @type {Array.<string>}
 */
var availableComponents = [
  'config',
  'controller',
  'model',
  'module',
  'service'
];

/**
 * Environment (dev or prod)
 * @type {string}
 */
var environment = null;

/**
 * Modules register
 * @type {Object.<string, Object.<string, Object>>}
 */
var register = {};

/**
 * Prepare register and getters for used components
 * @param {Array.<string>} components
 */
function prepareComponents(components) {
  _(components).each(function(component) {
    // add collection to register
    register[component] = {};
    // create getter
    this[component] = getItem.bind(this, component);
  }.bind(module.exports));
}

/**
 * Getter for modules
 * @param {string} component Type of module
 * @param {string} name Module name
 * @returns {Object} Module
 * @throws {Error} If invalid component or module requested
 */
function getItem(component, name) {
  if (!register[component]) {
    throw new Error('Invalid component \'' + component + '\'');
  }

  var envSuffix = '.' + environment;
  var appSuffix = '.app';
  var localSuffix = '.local';

  // find module according override priority
  var item = register[component][name + localSuffix + envSuffix] ||
    register[component][name + localSuffix] ||
    register[component][name + appSuffix + envSuffix] ||
    register[component][name + appSuffix] ||
    register[component][name + envSuffix] ||
    register[component][name];

  if (!item) {
    throw new Error(_(component).capitalize() + ' \'' + name + '\' does not exists');
  }

  return item;
}

/**
 * Register module
 * @param {string} component Type of module
 * @param {string} name Module name
 * @param {Object} object Module
 * @throws {Error} If module with the same name already exists
 */
function registerItem(component, name, object) {
  if (register[component][name]) {
    throw new Error(_(component).capitalize() + ' \'' + name + '\' already exists');
  }

  register[component][name] = object;
}

/**
 * Scan framework and app and register modules
 * @param {Array.<string>} components Types of modules
 */
function scanProject(components) {
  var paths = [
    PATH.FAF,
    PATH.APP
  ];

  _(paths).each(function(path) {
    _(components).each(function(component) {
      // global PATH alias
      var alias = (component + 's').toUpperCase();

      if (fs.existsSync(path[alias])) {
        scanProjectRecursive(component, path[alias]);
      }
    });
  });
}

/**
 * Recursive scan component dir
 * @param {string} component Type of module
 * @param {string} path Absolute path
 * @param {string=} opt_ns Module name prefix
 */
function scanProjectRecursive(component, path, opt_ns) {
  opt_ns = opt_ns || '';

  var files = fs.readdirSync(path);

  _(files).each(function(file) {
    var stats = fs.statSync(path + file);

    // scan recursive
    if (stats.isDirectory()) {
      scanProjectRecursive(
        component,
        path + file + '/',
        opt_ns + file + '.'
      );
    // register every .js file as a module
    } else if (stats.isFile() && _(file).endsWith('.js')) {
      registerItem(
        component,
        _(opt_ns + file).strLeftBack('.'),
        require(path + file)
      );
    }
  });
}

/**
 * Apply extends for registered modules
 * @throws {Error} If parent not found
 */
function applyExtends() {
  _(register).each(function(items, component) {
    _(items).each(function(item, name) {
      var parentName = item.extends || 'abstract';

      if (parentName === name) {
        parentName = null;
      }

      if (parentName) {
        var parent = register[component][parentName];

        if (!parent) {
          throw new Error('The parent \'' + parentName + '\' of ' + component + ' \'' + name + '\' does not exists');
        }

        // TODO use better way
        item.__proto__ = parent;
      }
    });
  });
}

/**
 * Get not abstract controllers
 * @returns {Array.<Object>} Controllers
 */
function getControllers() {
  var controllers = [];

  if (register.controller) {
    _(register.controller).each(function(item, name) {
      if (!is('abstract', name)) {
        controllers.push(item);
      }
    });
  }

  return controllers;
}

/**
 * Is module name contains keyword, separated by dot
 * @param {string} keyword Keyword (abstract|local|dev|prod|app)
 * @param {string} name Module name
 * @returns {boolean}
 */
function is(keyword, name) {
  var re = new RegExp('(^|\\.)' + _(keyword).escapeRegExp() + '($|\\.)');
  return re.test(name)
}

module.exports = {
  /**
   * Run app
   * @param {string=} opt_appDirname App absolute path
   * @param {function()=} opt_callback Callback on app run
   */
  run: function(opt_appDirname, opt_callback) {
    // if only callback passed as first argument
    if (_(opt_appDirname).isFunction()) {
      opt_callback = opt_appDirname;
      opt_appDirname = null;
    }

    // set default app path if not passed
    opt_appDirname = opt_appDirname || _(module.parent.filename).strLeftBack('/');

    globals.init();
    globals.setPaths(opt_appDirname, availableComponents);
    globals.register('faf', this);

    prepareComponents(availableComponents);

    scanProject(availableComponents);
    applyExtends();

    environment = this.config('env').ENV;

    // start web server
    require('./server/server').start(getControllers());

    // TODO allow async server start
    if (opt_callback) {
      opt_callback.call(this);
    }
  }
};
