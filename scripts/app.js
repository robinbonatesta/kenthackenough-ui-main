angular
  .module('khe', ['ngCookies', 'btford.socket-io', 'ui.router', 'ngAnimate', 'angularMoment'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $state, $route) {
    $locationProvider.html5Mode(true);
    $route.otherwise('/404');
    $state.state('404', {
      url: '/404',
      templateUrl: '/views/404.html'
    });
  }]);
