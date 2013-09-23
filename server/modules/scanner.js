var fs = require('fs');

module.exports = {
  /**
   * Recursive read dir
   * @param {string} path Dir path
   * @param {function(string)=} opt_filter Filter
   * @returns {Array.<string>} File paths
   */
  scan: function(path, opt_filter) {
    var files = [];

    fs.readdirSync(path).forEach(function(file) {
      if (fs.statSync(path + file).isDirectory()) {
        files = files.concat(this.scan(path + file + '/', opt_filter));
      } else if (!opt_filter || opt_filter.call(this, path + file)) {
        files.push(path + file);
      }
    }.bind(this));

    return files;
  }
};
