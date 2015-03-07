angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/', {
      templateUrl: '/home.html'
    });
  }])
  .controller('HomeCtrl', ['$scope', function ($scope) {

    var self = this;

    self.register = function () {

    };

    self.login = function () {

    };

  }]);