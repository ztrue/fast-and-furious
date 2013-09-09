var _ = require('underscore');

// add underscore.string extension
_.str = require('underscore.string');
_.mixin(_.str.exports());

// add custom extensions
_.mixin({
  /**
   * Escape RegExp
   * @param {string} string Part of RegExp
   * @returns {string} Escaped string
   */
  escapeRegExp: function(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  },

  unescapeRegExp: function(string) {
    // TODO
  }
});
