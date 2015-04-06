angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router
      .when('/application', {
        templateUrl: '/application.html',
        controller: 'ApplicationCtrl'
      });
  }])
  .controller('ApplicationCtrl', ['$location', '$filter', 'User', 'Application', function ($location, $filter, User, Application) {

    var self = this;
    var user = new User();
    var application = new Application();

    // Get the logged in user if it exists
    self.me = user.getMe();

    /**
    * An object with an array of possible dietary restrictions,
    * an array of selected restrictions, and a function to toggle a
    * selection.
    */
    self.diet = {
      possible: [
        'Vegetarian',
        'Vegan',
        'Kosher',
        'Gluten Free',
        'Other'
      ],
      selected: [],
      toggleSelection: function (restriction) {
        var idx = this.selected.indexOf(restriction);
        if (idx > -1) {
          this.selected.splice(idx, 1);
        } else {
          this.selected.push(restriction);
        }
      }
    };

    /**
    * Pre-populate the form if the user has already submitted
    * an application.
    */
    application.get().
    success(function (data) {
      console.log(data);
      if (data.application) {
        angular.extend(self, data.application);
        // translate a few things to populate the form
        console.log(self.dietary);
        self.name = self.name.split(' ');
        self.name.first = self.name[0];
        self.name.last = self.name[1];
        self.first = String(self.first);
        self.travel = String(self.travel);
        self.diet.selected = self.dietary;
        self.phone = $filter('formatPhone')(self.phone);
        self.submitted = true;
      } else {
        self.submitted = false;
      }
    }).
    error(function (data) {
      self.errors = data.errors || ['An internal error occurred'];
    });

    /**
    * Submit or update the user's application
    */
    self.submit = function () {
      // make a string of dietary restrictions
      var restrictions = null;
      if (self.diet.selected.length) {
        restrictions = '';
        for (var i = 0; i < self.diet.selected.length; ++i) {
          restrictions += self.diet.selected[i] + '|';
        }
        restrictions = restrictions.substr(0, restrictions.length - 1);
      }

      // build the application object
      var app = {
        name: self.name.first + ' ' + self.name.last,
        school: self.school,
        phone: self.phone.replace(/\D/g,''),
        shirt: self.shirt,
        demographic: self.demographic,
        first: self.first,
        year: self.year,
        age: self.age,
        gender: self.gender,
        major: self.major,
        conduct: self.conduct,
        travel: self.travel,
        waiver: self.waiver
      };
      if (restrictions) {
        angular.extend(app, {dietary: restrictions});
      }

      // submit the application
      if (self.submitted) {
        application.update(app).
        success(function (data) {
          $location.path('/');
        }).
        error(function (data) {
          self.errors = data.errors || ['An internal error occurred'];
        });
      } else {
        application.submit(app).
        success(function (data) {
          console.log(data);
          $location.path('/');
        }).
        error(function (data) {
          self.errors = data.errors || ['An internal error occurred'];
        });
      }
    };

  }]);
