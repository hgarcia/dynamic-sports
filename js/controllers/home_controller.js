/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', 'geoLocationService', 'fileService', 'serverService',
    function ($scope, geoLocationService, fileService, serverService) {
    'use strict';
    var fileName;

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      fileService.save(fileName, data, function () {}, function (error) {});
    }

    function errHandler(error) {
      alert("Error: " + error);
    }

    function filesSaved() {
      alert("Saved");
    }

    function uploadFiles(files) {
      serverService.upload(files, filesSaved, errHandler);
    }

    $scope.upload = function () {
      fileService.list(uploadFiles, errHandler);
    };

    $scope.recording = function (on) {
      if (on) {
        fileName = geoLocationService.start(onChange, errHandler);
      } else {
        geoLocationService.stop();
      }
    };
  }]);