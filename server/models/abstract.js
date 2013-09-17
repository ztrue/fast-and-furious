var _ = require('underscore');

module.exports = {
  /**
   * Constructor
   * @param {Object=} opt_data Model data
   * @constructor
   */
  constructor: function(opt_data) {
    this.set(opt_data);
  },

  /**
   * Set model data
   * @param {Object=} opt_data Model data
   */
  set: function(opt_data) {
    _(this).extend(opt_data);
    this.validate();
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
  }
};

module.exports.constructor.prototype = module.exports;
