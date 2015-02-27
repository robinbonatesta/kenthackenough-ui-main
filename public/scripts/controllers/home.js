angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/', {
      templateUrl: '/home.html'
    });
  }])
  .controller('HomeCtrl', [function () {



  }]);