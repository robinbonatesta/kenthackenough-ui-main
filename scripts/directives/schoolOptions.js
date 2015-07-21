angular
  .module('khe')
  .directive('schoolOptions', [function () {

    return {

      restrict: 'E',
      templateUrl: '/views/directives/school-option-list.html'

    };

  }]);