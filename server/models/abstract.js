module.exports = {
  /**
   * Constructor
   * @param {Object=} opt_data Model data
   * @constructor
   */
  constructor: function(opt_data) {},

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
