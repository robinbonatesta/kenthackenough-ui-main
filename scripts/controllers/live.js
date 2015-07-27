angular
  .module('khe')
  .config(['$stateProvider', function ($state) {
    $state
      .state('live', {
        url: '/live',
        templateUrl: '/views/live.html',
        controller: 'LiveCtrl as live'
      });
  }])
  .controller('LiveCtrl', ['User', function (User) {

    var view = this;

    var Models = {
      user: new User()
    };

    view.user = Models.user.getMe();

  }]);
