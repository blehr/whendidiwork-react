'use strict';

(function() {
  angular.module('createSheet', [])
    .controller('CreateSheetCtrl', ['$uibModal', '$http', '$window', '$scope',
      function($uibModal, $http, $window, $scope) {
        var sheet = this;

        sheet.isCollapsed = true;

        sheet.createSheet = function() {
          sheet.isCollapsed = true;
          var newSheet = {};
          newSheet.title = 'whendidiwork@' + sheet.newSheet;
          newSheet.mimeType = 'application/vnd.google-apps.spreadsheet';

          $http.post('api/:id/create-sheet', {
            "newSheet": newSheet
          }).then(function(data) {
            $scope.$emit('createdSheet', {
              msg: "Sheet Created"
            });
          });

        };

      }
    ]);

})();
