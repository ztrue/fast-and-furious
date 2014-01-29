module.exports = {
  /**
   * DB host
   * @type {string}
   */
  HOST: 'localhost',

  /**
   * DB name
   * @type {string}
   */
  NAME: null,

  /**
   * User password
   * @type {string}
   */
  PASSWORD: null,

  /**
   * User name
   * @type {string}
   */
  USER: null,

  /**
   * Connection options
   */
  options: {},

  /**
   * Get DB URI
   * @returns {null|string}
   */
  getUri: function() {
    var auth = this.USER && this.PASSWORD ? this.USER + ':' + this.PASSWORD + '@' : '';
    return this.HOST && this.NAME && 'mongodb://' + auth + this.HOST + '/' + this.NAME;
  }
};
