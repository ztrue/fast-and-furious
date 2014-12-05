/**
 * Date and time in local time zone
 */
angular
  .module('faf.datetime', [])
  .directive('datetime', ['$filter', function($filter) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/faf/directives/datetime/datetime.html',
      scope: {
        format: '@',
        value: '@'
      },
      link: function(scope) {
        scope.formattedTime = null;

        scope.$watch('[format, value] | json', function() {
          var value = scope.value.replace(/^(\d{4}\-\d{2}\-\d{2}) (\d{2}:\d{2}:\d{2})$/, '$1T$2Z');
          scope.formattedTime = $filter('date')(value, scope.format);
        });
      }
    };
  }]);
