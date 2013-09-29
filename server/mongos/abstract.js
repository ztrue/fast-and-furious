var _ = require('underscore');
var mongoose = require('mongoose');

module.exports = {
  /**
   * Schema types
   * @enum {Object}
   */
  SchemaTypes: mongoose.Schema.Types,

  /**
   * Model name
   * @type {string}
   */
  alias: null,

  /**
   * Model schema
   * @return {Object}
   */
  schema: function() {
    return {};
  },

  /**
   * Document methods
   * @return {Object.<string, function(*...)=>}
   */
  methods: function() {
    return {};
  },

  /**
   * Model static methods
   * @return {Object.<string, function(*...)=>}
   */
  static: function() {
    return {};
  },

  /**
   * @see abstract-component::configure
   */
  configure: function() {
    // create mongo schema
    var schema = new mongoose.Schema(this.schema());
    // add methods
    schema.method(this.methods());
    // add static methods
    _(this.static()).each(function(fn, method) {
      schema.static(method, fn);
    });
    // create mongo model
    this.model = mongoose.model(this.alias, schema);
  }
};
