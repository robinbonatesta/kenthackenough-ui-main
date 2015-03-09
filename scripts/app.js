angular
  .module('khe', ['ngRoute', 'ngCookies'])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);
