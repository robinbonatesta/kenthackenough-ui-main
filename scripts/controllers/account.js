angular
  .module('khe')
  .config(['$stateProvider', function ($state) {
    $state
      .state('account', {
        url: '/account',
        templateUrl: '/views/account.html',
        controller: 'AccountCtrl as acc'
      });
  }])
  .controller('AccountCtrl', ['User', '$location', function (User, $location) {

    var view = this;

    var Models = {
      user: new User()
    };

    view.user = Models.user.getMe();

    view.person = {

      email: null,
      password: null,

      successes: null,
      errors: null,

      /**
      * Update the user's account
      */
      update: function () {
        var self = this;
        Models.user.update({
          email: self.email,
          password: self.password
        }).
        success(function (data) {
          self.successes = ['Your account has been updated'];
          if (self.password) {
            self.logout();
            $location.path('/');
          }
        }).
        error(function (data) {
          self.errors = data.errors || ['An internal error has occurred'];
        });
      },

      /**
      * Logout
      */
      logout: function () {
        Models.user.removeMe();
        view.user = Models.user.getMe();
      }

    };

  }]);
