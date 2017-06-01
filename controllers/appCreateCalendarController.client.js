'use strict';

(function() {
  angular.module('createCalendar', [])
    .controller('CreateCalendarCtrl', [
      '$uibModal', '$http', '$window', '$scope',
      function($uibModal, $http, $window, $scope) {
      var cal = this;

      cal.isCollapsed = true;

      $scope.$on('setTimeZone', function(event, args) {
        cal.timeZone = args.msg;
      });

      cal.createCalendar = function() {
        cal.isCollapsed = true;
        var newCalendar = {};
        newCalendar.summary = 'whendidiwork@' + cal.newCalendar;
        newCalendar.timeZone = cal.timeZone;

        $http.post('/api/:id/create-calendar', {
          "newCalendar": newCalendar
        }).then(function(data) {
          $scope.$emit('createdCalendar', {
            msg: "Calendar created"
          });
        });
      };

    }]);

})();
