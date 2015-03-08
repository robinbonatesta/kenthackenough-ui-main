angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/', {
      templateUrl: '/home.html'
    });
  }])
  .controller('HomeCtrl', ['User', '$location', function (User, $location) {

    var self = this;
    var user = new User();
    self.user = user.getMe();

    // Register a user
    self.register = function () {
      user.register({
        email: self.email,
        password: self.password
      }).
      success(function (data) {
        self.errors = data.errors;
        if (!data.errors) {
          self.email = '';
          self.password = '';
          user.setMe(data);
          self.user = user.getMe();
          $location.path('/application');
        }
      }).
      error(function () {
        self.errors = ['An internal error has occurred'];
      });
    };

    // Login a user
    self.login = function () {
      user.login({
        email: self.email,
        password: self.password
      }).
      success(function (data) {
        self.errors = data.errors;
        if (!data.errors) {
          self.email = '';
          self.password = '';
          user.setMe(data);
          self.user = user.getMe();
        }
      }).
      error(function () {
        self.errors = ['An internal error has occurred'];
      });
    };

    // Logout
    self.logout = function () {
      user.removeMe();
      self.user = user.getMe();
    };

  }]);