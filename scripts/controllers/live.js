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
  .controller('LiveCtrl', ['Event', 'Message', function (Event, Message) {

    var view = this;

    var Models = {
      event: new Event(),
      message: new Message()
    };

    view.events = {

      all: [],
      days: {},

      /**
      * Retreive a list of all events
      */
      get: function () {
        var self = this;
        Models.event.list().
        success(function (data) {
          self.all = data.events;
          self.refresh();
        }).
        error(function (data) {
          view.errors = data.errors;
        });
      },

      /**
      * Connect to sockets and listen for changes to the schedule
      */
      listen: function () {
        var self = this;
        // Event created
        Models.event.socket().on('create', function (event) {
          self.all.push(event);
          self.refresh();
        });

        // Event updated
        Models.event.socket().on('update', function (event) {
          self.all = self.all.map(function (e) {
            if (e._id == event._id) e = event;
            return e;
          });
          self.refresh();
        });

        // Event deleted
        Models.event.socket().on('delete', function (event) {
          self.all = self.all.filter(function (e) {
            return e._id != event._id;
          });
          self.refresh();
        });
      },

      /**
      * Reload the lists
      */
      refresh: function () {
        var self = this;
        // sort events
        self.all = self.all.sort(function (a, b) {
          if (a.start > b.start) return 1;
          if (a.start < b.start) return -1;
          return 0;
        });
        // split out by day
        var days = [
          'Sunday', 'Monday',
          'Tuesday', 'Wednesday',
          'Thursday', 'Friday',
          'Saturday'
        ];
        for (var i = 0; i < self.all.length; i++) {
          var day = new Date(self.all[i].start).getDay();
          if (self.days[days[day]]) {
            self.days[days[day]].push(self.all[i]);
          } else {
            self.days[days[day]] = [self.all[i]];
          }
        }
      }

    };

    view.msg = {

      showing: 'few',

      all: [],
      messages: [],

      /**
      * Get a list of all messages
      */
      get: function () {
        var self = this;
        Models.message.list().
        success(function (data) {
          self.all = data.messages;
          self.refresh();
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
          self.all.push(message);
          self.refresh();

          // Calculate number of seconds to show notification
          var words = message.text.split(' ');
          var seconds = Math.ceil(words.length / 3.3);
          seconds = Math.max(seconds, 2);

          // Show a notification
          var notification = new Notify('Kent Hack Enough', {
            body: message.text,
            icon: '/img/logo-short-square-black.png',
            timeout: seconds
          });
          if (!Notify.needsPermission) {
            notification.show();
          }
        });

        // Message updated
        Models.message.socket().on('update', function (message) {
          self.all = self.all.map(function (m) {
            if (m._id == message._id) {
              m = message;
            }
            return m;
          });
          self.refresh();
        });

        // Message deleted
        Models.message.socket().on('delete', function (message) {
          self.all = self.all.filter(function (m) {
            return m._id != message._id;
          });
          self.refresh();
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
      },

      /**
      * Show all messages
      */
      showAll: function () {
        this.showing = 'all';
        this.messages = this.all;
      },

      /**
      * Show a few messages
      */
      showFew: function () {
        this.showing = 'few';
        this.messages = [];
        for (var i = 0; i < this.all.length; ++i) {
          this.messages.push(this.all[i]);
          if (i == 2) break;
        }
      },

      /**
      * Refresh the list of messages
      */
      refresh: function () {
        // Sort by date
        this.all = this.all.sort(function (a, b) {
          if (a.created < b.created) return 1;
          return -1;
        });
        if (this.showing == 'all') {
          this.showAll();
        } else if (this.showing == 'few') {
          this.showFew();
        }
      }

    };

    // Initialize the controller
    view.events.get();
    view.events.listen();
    view.msg.get();
    view.msg.listen();

  }]);
