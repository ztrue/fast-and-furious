var fs = require('fs');

module.exports = {
  /**
   * Recursive read dir
   * @param {string} path Dir path
   * @returns {Array.<string>} File paths
   */
  scan: function(path) {
    var files = [];

    fs.readdirSync(path).forEach(function(file) {
      if (fs.statSync(path + file).isDirectory()) {
        files = files.concat(this.scan(path + file + '/'));
      } else {
        files.push(path + file);
      }
    }.bind(this));

    return files;
  }
};
