angular
  .module('khe', ['ngCookies', 'btford.socket-io', 'ui.router', 'ngAnimate'])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
