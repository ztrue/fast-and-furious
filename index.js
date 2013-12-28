var fs = require('fs');
var _ = require('underscore');
var mongoose = require('mongoose');

var globals = require('./server/globals');
require('./server/utils');
var abstractComponent = require('./server/abstract-component');

/**
 * Default namespaces
 * @enum {string}
 */
var Ns = {
  APP: 'app.',
  FAF: 'faf.',
  ROOT: 'root.'
};

/**
 * Available Types of modules
 * @type {Array.<string>}
 */
var availableComponents = [
  'config',
  'controller',
  'model',
  'module',
  'mongo',
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
    // create getters
    this[component] = getItem.bind(this, component);
    abstractComponent[component] = this[component];
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
  var localSuffix = '.local';

  // find module according override priority
  var item = register[component][Ns.APP + name + envSuffix + localSuffix] ||
    register[component][Ns.APP + name + localSuffix] ||
    register[component][Ns.APP + name + envSuffix] ||
    register[component][Ns.APP + name] ||
    register[component][Ns.FAF + name + envSuffix] ||
    register[component][Ns.FAF + name];

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
 * @todo Use module scan
 * @todo Take other include paths from app as a parameter
 */
function scanProject(components) {
  var includes = [
    {
      path: PATH.FAF,
      ns: Ns.FAF
    },
    {
      path: PATH.APP,
      ns: Ns.APP
    }
  ];

  _(includes).each(function(include) {
    _(components).each(function(component) {
      // global PATH alias
      var alias = (component + 's').toUpperCase();

      if (fs.existsSync(include.path[alias])) {
        scanProjectRecursive(component, include.path[alias], include.ns);
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
  opt_ns = opt_ns || Ns.ROOT;

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
      var ns = _(name).strLeft('.') + '.';
      name = _(name).strRight('.');

      var parentName = item.extends || Ns.FAF + 'abstract';

      if (parentName === name || parentName === ns + name) {
        parentName = null;
      }

      var parent = abstractComponent;

      if (parentName) {
        parent = register[component][ns + parentName] ||
          register[component][parentName];

        if (!parent) {
          throw new Error('The parent \'' + parentName + '\' of ' + component + ' \'' + ns + name + '\' does not exists');
        }
      }

      // TODO use better way
      item.__proto__ = parent;
    });
  });
}

/**
 * Configure components
 */
function configure() {
  _(register).each(function(items) {
    _(items).each(function(item, name) {
      if (!is('abstract', name)) {
        item.configure();
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

/**
 * Run builder
 * @param {function()=} opt_callback Callback
 * @todo Use grunt instead
 */
function build(opt_callback) {
  var builder = module.exports.module('builder');
  var builderMethod = environment === 'prod' ? 'compile' : 'build';
  builder[builderMethod](opt_callback);
}

/**
 * Connect to DB if required
 * @param {function()=} opt_callback Callback
 */
function dbConnect(opt_callback) {
  if (module.exports.config('db').getUri()) {
    mongoose.connect(module.exports.config('db').getUri(), opt_callback);
  } else if (opt_callback) {
    opt_callback.call(this);
  }
}

/**
 * Initialize components
 * @param {string=} opt_appDirname App absolute path
 */
function initComponents(opt_appDirname) {
  // set default app path if not passed
  opt_appDirname = opt_appDirname || _(module.parent.filename).strLeftBack('/');

  globals.init();
  globals.setPaths(__dirname, opt_appDirname, availableComponents);
  globals.register('_', _);

  prepareComponents(availableComponents);

  scanProject(availableComponents);
  applyExtends();
  configure();

  environment = module.exports.config('env').ENV;
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

    initComponents(opt_appDirname);

    build(function() {
      dbConnect(function() {
        // start web server
        require('./server/server').start(
          this.config('server'),
          getControllers(),
          opt_callback
        );
      }.bind(this));
    }.bind(this));
  }
};
