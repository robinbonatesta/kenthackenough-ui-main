angular
  .module('khe', ['ngRoute', 'ngCookies', 'btford.socket-io'])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
