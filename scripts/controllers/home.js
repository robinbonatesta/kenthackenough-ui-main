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
  .controller('HomeCtrl', ['User', 'News', 'Ticket', 'Application', 'Message', '$location', function (User, News, Ticket, Application, Message, $location) {

    var view = this;

    var Models = {
      user: new User(),
      news: new News(),
      ticket: new Ticket(),
      application: new Application(),
      message: new Message()
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
          console.log(data);
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

    view.msg = {

      messages: [],

      /**
      * Get a list of all messages
      */
      get: function () {
        var self = this;
        Models.message.list().
        success(function (data) {
          self.messages = data.messages;
        }).
        error(function (data) {
          self.errors = data.errors;
        });
      },

      /**
      * Listen for changes to messages
      */
      listen: function () {
        var self = this;

        // Message created
        Models.message.socket().on('create', function (message) {
          self.messages.push(message);

          // Show a notification
          var notification = new Notify('Kent Hack Enough', {
            body: message.text
          });
          if (!Notify.needsPermission) {
            notification.show();
          }
        });

        // Message updated
        Models.message.socket().on('update', function (message) {
          self.messages = self.messages.map(function (m) {
            if (m._id == message._id) {
              m = message;
            }
            return m;
          });
        });

        // Message deleted
        Models.message.socket().on('delete', function (message) {
          self.messages = self.messages.filter(function (m) {
            return m._id != message._id;
          });
        });
      },

      /**
      * Prompts the user to enable notifications
      */
      enable: function () {
        Notify.requestPermission();
      },

      /**
      * Returns true if notifications are enabled
      */
      enabled: function () {
        return !Notify.needsPermission;
      }

    };
    view.msg.get();
    view.msg.listen();

  }]);
