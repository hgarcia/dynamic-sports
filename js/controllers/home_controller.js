/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', 'geoLocationService', 'fileService',
    function ($scope, geoLocationService, fileService) {
    'use strict';
    var fileName;

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      fileService.save(fileName, data, function () {}, function (error) {});
    }

    function onChangeError(error) {
      alert("Error: " + error);
    }

    $scope.recording = function (on) {
      if (on) {
        fileName = geoLocationService.start(onChange, onChangeError);
      } else {
        geoLocationService.stop();
        fileService.open(fileName, function (result) { alert(result); }, function (error) {alert("Err:" + error); });
      }
    };
    
  }]);