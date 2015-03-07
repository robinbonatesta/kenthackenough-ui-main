angular
  .module('khe', ['ngRoute'])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true)
  }]);