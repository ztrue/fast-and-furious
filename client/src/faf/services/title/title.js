// titleService from ng-boilerplate
angular
  .module('faf.title', [])
  .factory('$title', function($document) {
    var prefix = '';
    var title = '';
    var suffix = '';

    return {
      setPrefix: function(value) {
        prefix = value;
        this.apply();
      },

      getPrefix: function() {
        return prefix;
      },

      setSuffix: function(value) {
        suffix = value;
        this.apply();
      },

      getSuffix: function() {
        return suffix;
      },

      setTitle: function(value) {
        title = value;
        this.apply();
      },

      getTitle: function() {
        return title || $document.prop('title');
      },

      getFullTitle: function() {
        return this.getTitle() + this.getSuffix();
      },

      apply: function() {
        $document.prop('title', prefix + title + suffix);
      }
    }
  });
