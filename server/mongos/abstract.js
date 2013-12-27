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
   * Model pre hooks
   * @return {Object.<string, function(function())=>}
   */
  pre: function() {
    return {};
  },

  /**
   * Model post hooks
   * @return {Object.<string, function(Object)=>}
   */
  post: function() {
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
    // add pre hooks
    _(this.pre()).each(function(fn, key) {
      schema.pre(key, fn);
    });
    // add post hooks
    _(this.post()).each(function(fn, key) {
      schema.post(key, fn);
    });
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
