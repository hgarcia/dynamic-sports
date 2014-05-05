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