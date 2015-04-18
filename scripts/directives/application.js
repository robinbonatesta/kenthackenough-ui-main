angular
  .module('khe')
  .directive('application', ['$compile', function ($compile) {

    return {

      restrict: 'E',
      templateUrl: '/application.html',

      link: function (scope, element, attrs) {
        $compile(element.contents())(scope);

        jQuery(document).ready(function ($) {

          $.fn.extend({
            slideUpIn: function (callback) {
              this.fadeIn(50).animate({
                'top': '20vh'
              }, 200, callback);
              return this;
            },
            slideUpOut: function (callback) {
              this.animate({
                'top': '-100vh'
              }, 200).fadeOut(50, callback);
              return this;
            },
            slideDownIn: function (callback) {
              this.fadeIn(50).animate({
                'top': '20vh'
              }, 200, callback);
              return this;
            },
            slideDownOut: function (callback) {
              this.animate({
                'top': '200vh'
              }, 200).fadeOut(50, callback);
              return this;
            }
          });

          var steps = {
            steps: [],
            current: 0,

            addStep: function (elem) {
              this.steps.push(elem);
            },

            setForm: function (elem) {
              this.form = elem;
            },

            start: function () {
              var self = this;

              // prevent tab
              $(document).keydown(function(e) {
                if (e.keyCode == 9) {
                  e.preventDefault();
                }
              });

              // listen for next and previous buttons
              $('button.btn-prev').click(function () {
                self.prev();
              });

              $('button.btn-next').click(function () {
                self.next();
              });

              // listen for enter and shift+enter
              this.steps.forEach(function (step) {
                step.hide();
                step.keypress(function (event) {
                  if (event.keyCode == 13 && !event.shiftKey) {
                    if (self.current < self.steps.length - 1) {
                      event.preventDefault();
                      self.next();
                    }
                  } else if (event.keyCode == 13 && event.shiftKey) {
                    event.preventDefault();
                    self.prev();
                  }
                });
              });

              // show the first item
              this.steps[0].slideUpIn(function () {
                $(this).children('input:first, label:first, select:first, button:first').focus();
              });

              var meter = new Meter(10);
            },

            next: function () {
              if (this.current < this.steps.length - 1) {
                this.steps[this.current].slideUpOut();
                this.current++;
                this.steps[this.current].slideUpIn(function () {
                  $(this).children('input:first, label:first, select:first, button:first').focus();
                });
              }
            },

            prev: function () {
              if (this.current !== 0) {
                this.steps[this.current].slideDownOut();
                this.current--;
                this.steps[this.current].slideDownIn(function () {
                  $(this).children('input:first, label:first, select:first, button:first').focus();
                });
              }
            }
          };

          // Add all the steps
          $('#application .section').each(function (element) {
            steps.addStep($(this));
          });
          steps.start();

          /**
          * ********************************************************************
          */

          function Meter(count) {

            var self = this;

            self.meters = [];

            for (var i = 0; i < count; ++i) {
              $('footer').append('<svg id="meter-'+i+'"></svg>');
              self.meters.push(new Snap('#meter-'+i));
            }

            Snap.load('/img/pong_ball.svg', function (ball) {
              Snap.load('/img/solo_cup.svg', function (cup) {

                ball = ball.select('g');
                cup = cup.select('g');
                self.meters.forEach(function (meter) {
                  meter.append(ball);
                  meter.append(cup);

                  cup.transform('s0.2, t770,-270');
                  ball.transform('s0.2, t-100, 100');

                  var path = meter.path("M70,200 C500,-600 1300,400 1150,400");
                  path.attr({ fill: "none", stroke: "none", opacity: "1" });

                  self.animateGroupAlongPath(path, ball, 0, 500);
                });

              });
            });

          }

          Meter.prototype.animateGroupAlongPath = function (path, element, start, dur, callback) {
            var len = Snap.path.getTotalLength(path);
            Snap.animate(start, len, function (value) {
              var movePoint = Snap.path.getPointAtLength(path, value);

              element.transform('s0.2 t' + movePoint.x + ', ' + movePoint.y);
            }, dur, function () {
              callback && callback(path);
            });
          };

        });
      }

    };

  }]);