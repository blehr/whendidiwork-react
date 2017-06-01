'use strict';

(function() {

  angular.module('app', [
    'ui.bootstrap.datetimepicker',
    'angular-loading-bar',
    'ui.bootstrap',
    'ngAnimate',
    'app.factory',
    'createCalendar',
    'createSheet',
    'app.directive'
  ])

  .controller('AppCtrl', [
    '$scope',
    '$http',
    '$window',
    '$uibModal',
    '$timeout',
    'appFactory',
    function($scope,
      $http,
      $window,
      $uibModal,
      $timeout,
      appFactory) {

    var self = this;

    self.isCollapsed = true;

    self.myForm = {};
    self.myForm.clockIn = new Date();
    self.myForm.clockOut = new Date();
    self.myForm.calendar = '';
    self.myForm.eventId = '';
    self.sheetId = '';
    self.confirmedSummary = '';
    self.isEditing = false;

    self.getMySheets = appFactory.getSheets;

    $scope.$on('createdSheet', function() {
      self.getMySheets().then(function(data) {
        self.sheets = data.data.items;
        self.updateSheetProps();
      });
    });

    self.getMyCalendars = appFactory.getCalendars;

    $scope.$on('createdCalendar', function() {
      self.getMyCalendars().then(function(data) {
        self.listCalendars = data.data.items;
        self.listCalendars.forEach(function(cal) {
          if (cal.primary === true) {
            self.timeZone = cal.timeZone;
          }
        });
      });
    });

    self.getUser = function() {
      appFactory.getUser().then(function(result) {
        self.user = result.data;
        self.myForm.calendar = self.user.lastUsed.calendar;
        self.myForm.sheet = self.user.lastUsed.sheet;
        if (self.myForm.calendar !== '') {
          self.getCalendarEvents();
        }
        self.getFiles();
      });
    };

    self.getFiles = function() {
      self.isCollapsed = true;
      self.getMySheets().then(function(data) {
        self.sheets = data.data.items;
        if (self.sheets.length === 0) {
          self.confirmedSummary = 'To begin, first create a whendidiwork sheet';
        } else {
          self.updateSheetProps();
        }
      });
    };

    self.getCalendarsList = function() {
      self.getMyCalendars().then(function(data) {
        self.listCalendars = data.data.items;
        self.listCalendars.forEach(function(cal) {
          if (cal.primary === true) {
            self.timeZone = cal.timeZone;
            $scope.$broadcast('setTimeZone', {
              msg: self.timeZone
            });
          }
        });
      });
    };



    self.eventEditing = function(id, start, end, summary) {
      self.isEditing = true;
      self.myForm.clockIn = start;
      self.myForm.clockOut = end;
      self.myForm.eventId = id;
      self.myForm.summary = summary;
    };

    self.logout = function() {
      $window.location.href = '/logout';
    };

    self.updateEvent = function() {
      self.isCollapsed = true;
      var event = {
        "summary": self.myForm.summary,
        "start": {
          "dateTime": self.myForm.clockIn,
          "timeZone": self.timeZone
        },
        "end": {
          "dateTime": self.myForm.clockOut,
          "timeZone": self.timeZone
        }
      };

      if (event.end.dateTime < event.start.dateTime) {
        alert('Event end time must come after start time!');
        return;
      }

      if (self.sheetId === '') {
        $window.alert('Please select a Sheet');
        return;
      }

      if (self.myForm.calendar === '') {
        $window.alert('Please select a calendar');
        return;
      }

      if (self.sheetId !== '' && self.myForm.calendar !== '') {
        $http.put('/api/:id/calendarevents/' + self.myForm.calendar + '/' + self.myForm.eventId, {"event": event}).then(function(data) {
          self.eventConfirmation(data);
          self.cancelEdit();
          self.getCalendarEvents();
        });
      }
    };


    self.removeEvent = function(eventId) {
      self.isCollapsed = true;
      $http.delete('/api/:id/delete-event/' + self.myForm.calendar + '/' + eventId).then(function(data) {
        if (data.data.body !== "") {
          self.confirmedSummary = 'This event can\'t be deleted';
          self.confirmedStart = '';
          self.confirmedEnd = '';
        } else {
          self.confirmedSummary = 'Event successfully deleted';
          self.confirmedStart = '';
          self.confirmedEnd = '';
        }
        self.cancelEdit();
        self.getCalendarEvents();
      });
    };

    self.cancelEdit = function() {
      self.isEditing = false;
      self.myForm.clockIn = new Date();
      self.myForm.clockOut = new Date();
      self.myForm.eventId = "";
      self.updateSheetProps();
    };

    self.getCalendarEvents = function() {
      self.isCollapsed = true;
      $http.get('/api/:id/calendarevents/' + self.myForm.calendar).then(function(data) {
        self.events = data.data.items;
      });
    };

    self.submitForm = function() {
      self.isCollapsed = true;

      var event = {
        "summary": self.myForm.summary,
        "start": {
          "dateTime": self.myForm.clockIn,
          "timeZone": self.timeZone
        },
        "end": {
          "dateTime": self.myForm.clockOut,
          "timeZone": self.timeZone
        }
      };

      if (event.end.dateTime < event.start.dateTime) {
        alert('Event end time must come after start time!');
        return;
      }

      if (self.sheetId === '') {
        $window.alert('Please select a Sheet');
        return;
      }

      if (self.myForm.calendar === '') {
        $window.alert('Please select a calendar');
        return;
      }

      if (self.sheetId !== '' && self.myForm.calendar !== '') {
        $http.post('api/:id/create-event/' + self.myForm.calendar + '/' + self.sheetId + '/' + self.nextRow, {
          "event": event
        }).then(function(data) {
          self.eventConfirmation(data);
          self.cancelEdit();
          self.getCalendarEvents();
        });
      }
    };

    self.updateSheetProps = function() {
      if (self.myForm.sheet === '') {
        self.sheetLink = '';
        self.myForm.summary = '';
        self.sheetId = '';
      } else {
        angular.forEach(self.sheets, function(sheet) {
          if (sheet.id === self.myForm.sheet) {
            self.sheetLink = 'https://docs.google.com/spreadsheets/d/' + sheet.id;
            self.myForm.summary = sheet.title.substring(12) + ': ';
            self.sheetId = sheet.id;
            self.getSheetMeta();
          }
        });
      }

    };

    self.getSheetMeta = function() {
      if (self.sheetId !== '') {
        $http.get('api/:id/sheet/' + self.sheetId).then(function(data) {
          self.nextRow = data.data[0].nextRow;
          var sheetRows = data.data[1];
          var sheetRowsProps = [];
          self.rowsArray = [];

          for (var row in sheetRows) {
            sheetRowsProps.push(row);
          }

          var lastTenRows = sheetRowsProps.slice(-14);

          lastTenRows.forEach(function(row) {
            return self.rowsArray.push(sheetRows[row]);
          });
        });
      }
    };

    self.revealSheet = function() {
      self.isCollapsed = !self.isCollapsed;
      if (self.isCollapsed === false) {
        self.updateSheetProps();
      }
    };

    self.eventConfirmation = function(data) {
      if (!data.data.summary) {
        self.confirmedSummary = 'This event can\'t be updated';
        self.confirmedStart = '';
        self.confirmedEnd = '';
      } else {
        self.confirmedSummary = data.data.summary;
        self.confirmedStart = data.data.start.dateTime;
        self.confirmedEnd = data.data.end.dateTime;
      }
    };

    self.checkTokenTime = function() {
      $timeout(self.checkTimediff, 300000); //5 minutes
    };

    self.checkTimediff = function() {
      $http.get('api/:id/check-token', {
        ignoreLoadingBar: true
      }).then(function(data) {
        console.log(data.data.expires_in);
        if (data.data.expires_in < 300) {
          $window.location.href = '/logout';
        }
        if (data.data.expires_in < 600) {
          self.confirmedSummary = '5 minutes remaining on this session.';
          self.confirmedStart = 'Please log out and back in, to start again.';
        }
        self.checkTokenTime();
      });

    };




    //initial calls
    self.getUser();
    self.getCalendarsList();
    self.checkTokenTime();



  }]);

})();
