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
  .controller('HomeCtrl', ['User', 'News', 'Ticket', '$location', function (User, News, Ticket, $location) {

    var view = this;

    var Models = {
      user: new User(),
      news: new News(),
      ticket: new Ticket()
    };

    view.user = Models.user.getMe();

    view.person = {

      email: null,
      password: null,
      errors: null,

      /**
      * Register a new user
      */
      register: function () {
        var self = this;
        Models.user.register({
          email: view.email,
          password: view.password
        }).
        success(function (data) {
          self.errors = null;
          self.email = '';
          self.password = '';
          Models.user.setMe(data);
          view.user = Models.user.getMe();
          $location.path('/apply');
        }).
        error(function (data) {
          if (data) {
            self.errors = data.errors || ['An internal error has occurred'];
          }
        });
      },

      /**
      * Login a user
      */
      login: function () {
        var self = this;
        Models.user.login({
          email: self.email,
          password: self.password
        }).
        success(function (data) {
          self.email = null;
          self.password = null;
          Models.user.setMe(data);
          view.user = Models.user.getMe();
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

    view.mail = {

      email: null,
      errors: null,
      successes: null,

      add: function () {
        var self = this;
        Models.news.create(self.email).
        success(function (data) {
          self.errors = null;
          self.successes = ['Thanks, you\'ll be hearing from us soon!'];
          self.email = null;
        }).
        error(function (data) {
          self.errors = ['That email is already in use.'];
          self.successes = null;
          self.email = null;
        });
      }

    };

    view.contact = {

      new: {},

      successes: null,
      errors: null,

      submit: function () {
        var self = this;
        Models.ticket.create(self.new).
        success(function (data) {
          self.errors = null;
          self.successes = ['Thank you, one of our organizers will reach out to you soon!'];
          self.new = {};
        }).
        error(function (data) {
          self.errors = data.errors;
          self.successes = null;
        });
      }

    };

  }]);
