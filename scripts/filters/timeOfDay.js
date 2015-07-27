angular
  .module('khe')
  .filter('timeOfDay', function () {
    return function (input) {
      return moment(input).format('h:mma');
    };
  });