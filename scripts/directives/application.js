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

          var s = new Snap('#ball-cup');

          Snap.load('/img/pong_ball.svg', function (ball) {
            Snap.load('/img/solo_cup.svg', function (cup) {

              // Add the elements to the page
              ball = ball.select('g');
              cup = cup.select('g');
              s.append(ball);
              s.append(cup);

              cup.transform('s0.5, t1200,100');
              ball.transform('s0.5, t0, 100');

              var path = s.path("M70,200 C400,-600 1750,400 1300,300");
              path.attr({ fill: "none", stroke: "black", opacity: "1" });

              animateGroupAlongPath(path, ball, 0, 1000);

            });
          });

          var animateGroupAlongPath = function (path, element, start, dur, callback) {
            var len = Snap.path.getTotalLength(path);

            Snap.animate(start, len, function (value) {
              var movePoint = Snap.path.getPointAtLength(path, value);

              element.transform('s0.5 t' + movePoint.x + ', ' + movePoint.y);
            }, dur, mina.easeinout, function () {
              callback && callback(path);
            });
          };

        });
      }

    };

  }]);