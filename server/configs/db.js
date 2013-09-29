module.exports = {
  /**
   * DB host
   */
  HOST: 'localhost',

  /**
   * DB name
   */
  NAME: null,

  /**
   * Connection options
   */
  options: {},

  /**
   * Get DB URI
   * @returns {null|string}
   */
  getUri: function() {
    return this.HOST && this.NAME && 'mongodb://' + this.HOST + '/' + this.NAME;
  }
};
