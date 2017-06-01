'use strict';

(function() {
  angular.module('app.factory', [])
    .factory('appFactory', function($http) {
      var factoryObj = {};

      factoryObj.getUser = function() {
        return $http.get('/api/:id');
      };

      factoryObj.getCalendars = function() {
        return $http.get('/api/:id/calendarlist');
      };

      factoryObj.getSheets = function() {
        return $http.get('api/:id/drivelist');
      };

      return factoryObj;

    });
})();
