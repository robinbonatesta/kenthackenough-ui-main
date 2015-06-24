angular
  .module('khe')
  .config(['$stateProvider', function ($state) {
    $state
      .state('home', {
        url: '/',
        templateUrl: '/views/home.html',
        controller: 'HomeCtrl as home'
      });
  }])
  .controller('HomeCtrl', ['User', 'News', 'Ticket', 'Application', '$location', function (User, News, Ticket, Application, $location) {

    var view = this;

    var Models = {
      user: new User(),
      news: new News(),
      ticket: new Ticket(),
      application: new Application()
    };

    view.user = Models.user.getMe();

    /**
    * Allow for RSVP if the user has already submitted an application.
    */
    if (view.user) {
      Models.application.get().
      success(function (data) {
        if (data.application) {
          view.application = data.application;
        }
      }).
      error(function (data) {
      });
    }

    view.person = {

      email: null,
      password: null,
      errors: null,

      /**
      * Register a new user
      */
      register: function () {
        console.log('Register function ran');
        var self = this;
        Models.user.register({
          email: self.email,
          password: self.password
        }).
        success(function (data) {
          self.errors = null;
          self.email = '';
          self.password = '';
          Models.user.setMe(data);
          view.user = Models.user.getMe();
          console.log('Register successful');
          console.log(data);
          console.log('about to change location');
          $location.path('/apply');
          console.log('after change location');
        }).
        error(function (data) {
          console.log('Register error');
          console.log(data);
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

    view.apply = {

      toggleGoing: function () {
        view.application.going = (view.application.going) ? false : true;
        Models.application.update(view.application).
        success(function (data) {
          view.application = data.application;
        }).
        error(function (data) {
          view.errors = data.errors;
        });
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
