angular
  .module('khe')
  .directive('card', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      template: '<img src="/img/ace_of_hearts.svg" id="card" class="wow rotateInDownLeft animated float-left">',

      link: function (scope, element, attrs) {
        $compile(element.contents())(scope);

        jQuery(document).ready(function ($) {

          /**
          * TODO !!!!
          * Show only on screens with width > 1360px
          */

          new WOW({offset: 200}).init();

        });
      }

    };

  }]);