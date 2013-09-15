/**
 * Date and time in local time zone
 */
angular
  .module('faf.datetime', [])
  .directive('datetime', ['$filter', function($filter) {
    return {
      restrict: 'E',
      templateUrl: '/faf/directives/datetime/datetime.tpl.html',
      scope: {
        format: '@',
        value: '@'
      },
      link: function(scope) {
        scope.formattedTime = null;

        scope.$watch('[format, value] | json', function() {
          scope.formattedTime = $filter('date')(scope.value, scope.format);
        });
      }
    };
  }]);
