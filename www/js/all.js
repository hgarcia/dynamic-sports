/* globals angular */
angular
  .module('dynamic-sports', ['ionic', 'dynamic-sports.controllers', 'dynamic-sports.services', 'dynamic-sports.directives'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      });

    $urlRouterProvider.otherwise('/home');
  }]);
/* globals angular, console */
angular.module('dynamic-sports.controllers', []);
/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', 'geoLocationService', 'fileService',
    function ($scope, geoLocationService, fileService) {
    'use strict';

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      fileService.save(data, function (error) {}, function () {});
    }

    function onChangeError(error) {
      alert("Error: " + error);
    }

    $scope.recording = function (on) {
      if (on) {
        geoLocationService.start(onChange, onChangeError);
      } else {
        geoLocationService.stop();
        fileService.open(function (error) {alert("Err:" + error); }, function (result) { alert(result); });
      }
    };
    
  }]);
angular.module('dynamic-sports.directives', []);
angular.module('dynamic-sports.directives')
  .controller('PlayStopButtonController', ['$scope', function ($scope) {
    'use strict';
    $scope.isOn = false;
    $scope.click = function () {
      $scope.isOn = !$scope.isOn;
      if ($scope.clickHandler) {
        $scope.clickHandler($scope.isOn);
      }
    };
  }])
  .directive('playStopButton', function () {
    'use strict';
    return {
      templateUrl: 'templates/directives/play-stop-button.html',
      scope: {clickHandler: '='},
      controller: 'PlayStopButtonController',
      replace: false,
      restrict: 'E'
    };
  });
angular.module('dynamic-sports.services', []);

/* globals angular */
angular.module('dynamic-sports.services')
  .factory('fileService', function () {
  'use strict';

    function writeToFile(data, successCb) {
      return function (writer) {
        writer.onwriteend = function(evt) {
          if (successCb) {
            successCb();
          }
        };
        writer.seek(writer.length);
        writer.write(JSON.stringify(data));
      };
    }

    function gotFileEntry(data, successCb, errorCb) {
      return function(fileEntry) {
        fileEntry.createWriter(writeToFile(data, successCb), errorCb);
      };
    }

    function write(fileName, data, successCb, errorCb) {
      return function (fileSystem) {
        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry(data, successCb, errorCb), errorCb);
      };
    }

    function fileContents(successCb) {
      return function (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
          successCb(evt.target.result);
        };
        reader.readAsText(file);
      };
    }

    function readFile(successCb, errorCb) {
      return function (fileEntry) {
        fileEntry.file(fileContents(successCb), errorCb);
      };
    }

    function read(fileName, successCb, errorCb) {
      return function (fileSystem) {
        fileSystem.root.getFile(fileName, null, readFile(successCb, errorCb), errorCb);
      };
    }

    return {
      save: function (fileName, data, successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, write(fileName, data, successCb, errorCb), errorCb);
      },
      open: function (fileName, successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, read(fileName, successCb, errorCb), errorCb);
      }
    };
  });

/* globals angular */
angular.module('dynamic-sports.services')
  .factory('geoLocationService', function () {
    'use strict';
    var watchId;
    return {
      start: function (success, error) {
        watchId = navigator.geolocation.watchPosition(success, error);
      },
      stop: function () {
        if (watchId) {
           navigator.geolocation.clearWatch(watchId);
        }
      }
    };
  });
