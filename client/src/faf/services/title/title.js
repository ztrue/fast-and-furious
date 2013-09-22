// titleService from ng-boilerplate
angular
  .module('faf.title', [])
  .factory('$title', function($document) {
    var suffix = '';
    var title = '';

    return {
      setSuffix: function(value) {
        suffix = value;
      },

      getSuffix: function() {
        return suffix;
      },

      setTitle: function(value) {
        title = value + suffix;
        $document.prop('title', title);
      },

      getTitle: function() {
        return $document.prop('title');
      }
    }
  });
