var _ = require('underscore');

/**
 * App and framework paths
 * @const {Object.<string, Object.<string, string>>}
 */
var PATH = {
  APP: {},
  FAF: {}
};

/**
 * Time constants
 * @const {Object.<string, number>}
 */
var TIME = {};

TIME.MONTHS_IN_YEAR = 12;

TIME.DAYS_IN_WEEK = 7;
TIME.DAYS_IN_MONTH = 30;
TIME.DAYS_IN_YEAR = 365;

TIME.HOURS_IN_DAY = 24;
TIME.HOURS_IN_WEEK = TIME.HOURS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.HOURS_IN_MONTH = TIME.HOURS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.HOURS_IN_YEAR = TIME.HOURS_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.MINUTES_IN_HOUR = 60;
TIME.MINUTES_IN_DAY = TIME.MINUTES_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.MINUTES_IN_WEEK = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.MINUTES_IN_MONTH = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.MINUTES_IN_YEAR = TIME.MINUTES_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.SECONDS_IN_MINUTE = 60;
TIME.SECONDS_IN_HOUR = TIME.SECONDS_IN_MINUTE * TIME.MINUTES_IN_HOUR;
TIME.SECONDS_IN_DAY = TIME.SECONDS_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.SECONDS_IN_WEEK = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.SECONDS_IN_MONTH = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.SECONDS_IN_YEAR = TIME.SECONDS_IN_DAY * TIME.DAYS_IN_YEAR;

TIME.MS_IN_SECOND = 1000;
TIME.MS_IN_MINUTE = TIME.MS_IN_SECOND * TIME.SECONDS_IN_MINUTE;
TIME.MS_IN_HOUR = TIME.MS_IN_MINUTE * TIME.MINUTES_IN_HOUR;
TIME.MS_IN_DAY = TIME.MS_IN_HOUR * TIME.HOURS_IN_DAY;
TIME.MS_IN_WEEK = TIME.MS_IN_DAY * TIME.DAYS_IN_WEEK;
TIME.MS_IN_MONTH = TIME.MS_IN_DAY * TIME.DAYS_IN_MONTH;
TIME.MS_IN_YEAR = TIME.MS_IN_DAY * TIME.DAYS_IN_YEAR;

/**
 * Add paths for dir
 * @param {Object} variable Paths container
 * @param {string} rootPath Root path
 * @param {Array.<string>=} opt_components Types of modules
 */
function addPaths(variable, rootPath, opt_components) {
  variable.ROOT = rootPath;

  variable.SERVER = variable.ROOT + 'server/';

  // add paths for components
  if (opt_components) {
    _(opt_components).each(function(component) {
      var dir = component + 's';
      variable[dir.toUpperCase()] = variable.SERVER + dir + '/';
    });
  }

  variable.CLIENT = variable.ROOT + 'client/';

  variable.BIN = variable.CLIENT + 'bin/';
  variable.BUILD = variable.CLIENT + 'build/';
  variable.SRC = variable.CLIENT + 'src/';
  variable.VENDOR = variable.CLIENT + 'vendor/';
}

module.exports = {
  /**
   * Register predefined constants
   */
  init: function() {
    this.register('ENCODING', 'utf8');
    this.register('TIME', TIME);
    this.register('PATH', PATH);
  },

  /**
   * Register global variable or constant
   * @param {string} name Variable name
   * @param {*} value Variable value
   */
  register: function(name, value) {
    GLOBAL[name] = value;
  },

  /**
   * Set paths for app and framework
   * @param {string} fafDirname Framework dir
   * @param {string} appDirname App root dir
   * @param {Array.<string>=} opt_components Types of modules
   */
  setPaths: function(fafDirname, appDirname, opt_components) {
    addPaths(PATH.FAF, fafDirname + '/', opt_components);
    addPaths(PATH.APP, appDirname + '/', opt_components);
  }
};
