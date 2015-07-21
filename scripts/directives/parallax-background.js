angular
  .module('khe')
  .directive('parallaxBackground', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      template: '<img src="/img/layer1.svg" id="layer1"><img src="/img/layer2.svg" id="layer2">',

      link: function (scope, element, attrs) {
        $compile(element.contents())(scope);

        jQuery(document).ready(function ($) {

          $(document).scroll(function () {
            var position = $(window).scrollTop();
            $('#layer1').css({top: position / 1.5});
            $('#layer2').css({top: position / 1.2});
          });

        });
      }

    };

  }]);