angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/', {
      templateUrl: '/home.html',
      controller: 'HomeCtrl as home'
    }).when('/login', {
      templateUrl: '/login.html',
      controller: 'HomeCtrl as home'
    });
  }])
  .controller('HomeCtrl', ['User', 'News', '$location', function (User, News, $location) {

    var self = this;
    var user = new User();
    var news = new News();
    self.user = user.getMe();

    // Register a user
    self.register = function () {
      user.register({
        email: self.email,
        password: self.password
      }).
      success(function (data) {
        self.email = '';
        self.password = '';
        user.setMe(data);
        self.user = user.getMe();
        $location.path('/application');
      }).
      error(function (data) {
        if (data) {
          self.errors = data.errors || ['An internal error has occurred'];
        }
      });
    };

    // Login a user
    self.login = function () {
      user.login({
        email: self.email,
        password: self.password
      }).
      success(function (data) {
        self.email = '';
        self.password = '';
        user.setMe(data);
        self.user = user.getMe();
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
      });
    };

    // Logout
    self.logout = function () {
      user.removeMe();
      self.user = user.getMe();
    };

    // Add to a mailing list
    self.mail = function () {
      news.create(self.email).
      success(function (data) {
        self.error = false;
        self.success = true;
        self.email = null;
      }).
      error(function (data) {
        self.error = true;
        self.success = false;
        self.email = null;
      });
    };

  }]);
