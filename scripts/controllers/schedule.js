angular
  .module('khe')
  .config(['$stateProvider', function ($state) {
    $state
      .state('schedule', {
        url: '/schedule',
        templateUrl: '/views/schedule.html',
        controller: 'ScheduleCtrl as schedule'
      });
  }])
  .controller('ScheduleCtrl', ['Event', function (Event) {

    var view = this;

    var Models = {
      event: new Event()
    };

    view.events = {

      all: [],

      /**
      * Retreive a list of all events
      */
      get: function () {
        var self = this;
        Models.event.list().
        success(function (data) {
          self.all = data.events;
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
        });

        // Event updated
        Models.event.socket().on('update', function (event) {
          self.all = self.all.map(function (e) {
            if (e._id == event._id) e = event;
            return e;
          });
        });

        // Event deleted
        Models.event.socket().on('delete', function (event) {
          self.all = self.all.filter(function (e) {
            return e._id != event._id;
          });
        });
      }

    };

    // Initialize the controller
    view.events.get();
    view.events.listen();

  }]);
