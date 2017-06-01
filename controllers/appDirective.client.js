'use strict';

(function() {
  angular.module('app.directive', [])
    .directive('scrollOnClick', function() {
      return {
        restrict: 'A',
        link: function(scope, $elm) {
          $elm.on('click', function() {
            $("body").animate({
              scrollTop: $('.top-row').offset().top
            }, "slow");
          });
        }
      };
    });

})();
