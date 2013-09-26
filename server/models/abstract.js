var _ = require('underscore');

/**
 * Constructor
 * @param {Object=} opt_data Model data
 * @constructor
 */
function Abstract(opt_data) {
  this.set(opt_data);
}

module.exports = {
  constructor: Abstract,

  /**
   * Prototype configure
   */
  configure: function() {},

  /**
   * Set model data
   * @param {Object=} opt_data Model data
   */
  set: function(opt_data) {
    if (opt_data) {
      _(this).extend(opt_data);
      this.validate();
    }
  },

  /**
   * Validate model data
   */
  validate: function() {},

  /**
   * Create new model
   * @param {Object=} opt_data Model data
   * @returns {Object}
   */
  new: function(opt_data) {
    return new this.constructor(opt_data);
  },

  /**
   * Clone model
   * @param {Object=} opt_data Model data
   * @returns {Abstract}
   */
  clone: function(opt_data) {
    var model = _(this).clone();
    model.set(opt_data);
    return model;
  }
};

Abstract.prototype = module.exports;
