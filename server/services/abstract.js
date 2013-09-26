module.exports = {
  /**
   * Service params
   * @type {Object}
   */
  params: {},

  /**
   * Service configure
   */
  configure: function() {},

  /**
   * Execute service
   * @param {Object=} opt_params
   * @param {function(Error?, *...)=} opt_callback
   */
  exec: function(opt_params, opt_callback) {
    var params = this.assign(this.params, opt_params);
    this.validate(params, opt_callback || function() {});
  },

  /**
   * Assign params
   * @param {Object} defaultParams Default params
   * @param {Object} opt_passedParams Passed params
   * @param {Object} opt_mergedParams Merged params
   * @returns {Object} Merged params
   */
  assign: function(defaultParams, opt_passedParams, opt_mergedParams) {
    opt_mergedParams = opt_mergedParams || {};

    for (var key in defaultParams) {
      if (defaultParams.hasOwnProperty(key)) {
        var defaultValue = defaultParams[key];
        // object
        if (typeof defaultValue === 'object'
          && defaultValue !== null
          && !(defaultValue instanceof Array)
          ) {
          var passedValue = typeof opt_passedParams === 'object'
              && opt_passedParams !== null
              && !(opt_passedParams instanceof Array)
            ? opt_passedParams[key]
            : undefined;

          opt_mergedParams[key] = {};

          this.assign(defaultValue, passedValue, opt_mergedParams[key]);
          // scalar or array
        } else {
          opt_mergedParams[key] = opt_passedParams && opt_passedParams[key] !== undefined
            ? opt_passedParams[key]
            : defaultValue;
        }
      }
    }

    return opt_mergedParams;
  },

  /**
   * Validate params
   * @param {Object} params Params
   * @param callback Callback
   */
  validate: function(params, callback) {
    this.perform(params, callback);
  },

  /**
   * Perform work
   * @param {Object} params Params
   * @param callback Callback
   */
  perform: function(params, callback) {
    this.response(callback);
  },

  /**
   * Send response
   * @param {function()} callback Callback
   * @param {*...} var_arg Response arguments
   */
  response: function(callback, var_arg) {
    if (callback) {
      var args = Array.prototype.slice.call(arguments, 1);
      callback.apply(this, args);
    }
  }
};
