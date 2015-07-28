angular
  .module('khe')
  .directive('instagram', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      templateUrl: '/views/directives/instagram.html',

      link: function (scope, element, attrs) {
        $compile(element.contents())(scope);

        var feed = new Instafeed({
          clientId: '5ba607adc8384546ba7c10f6c97ac19f',
          get: 'popular',
          // tagName: 'car',
          template: '<a href="{{link}}"><img src="{{image}}" /></a>',
          target: 'instagram',
          sortBy: 'most-recent',
          links: true,
          limit: 3,
          resolution: 'low_resolution'
        });
        feed.run();
      }

    };

  }]);