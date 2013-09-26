var mongoose = require('mongoose');

function Mongo() {}

module.exports = {
  constructor: Mongo,

  mongoModel: null,

  schema: {},

  configure: function() {
    this.mongoModel = new mongoose.Schema(this.schema);
  }
};

Mongo.prototype = module.exports;
