/**
 * Reverse array
 */
angular
  .module('faf.reverse', [])
  .filter('reverse', function() {
    return function(source) {
      var result = [];
      // do not use native reverse function, because it change source array
      angular.forEach(source, function(item) {
        result.unshift(item);
      });

      return result;
    };
  });
