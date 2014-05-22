/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', '$timeout', '$interval', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
    function ($scope, $timeout, $interval, $ionicPlatform, geoLocationService, fileService, serverService) {
    'use strict';
    var fileName;
    var elapsedTimer;
    var duration;
    var prevCoord;

    $scope.uploading = false;
    $scope.uploadDisabled = false;
    $scope.uploadErrored = false;
    $scope.uploadSucceded = false;
    $scope.uploadMessage = "";
    $scope.totalFiles = 0;

    function resetSession() {
      $scope.session = {avgSpeed: 0, distance: 0, elapsed: "00:00"};
    }

    function toRad(value) {
      var RADIANT_CONSTANT = 0.0174532925199433;
      return (value * RADIANT_CONSTANT);
    }

    function calculateDistance(starting, ending) {
      /*
      latitude":43.64241221061246,"longitude":-79.37423813140495
      latitude":43.6424056308755 ,"longitude":-79.37427474668694
      */
      var KM_RATIO = 6371;
      try {      
        var dLat = toRad(ending.latitude - starting.latitude);
        var dLon = toRad(ending.longitude - starting.longitude);
        var lat1Rad = toRad(starting.latitude);
        var lat2Rad = toRad(ending.latitude);
        
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = KM_RATIO * c;
        return d;
      } catch(e) {
        return -1;
      }
    }

    $scope.distance = calculateDistance;

    function setSpeed(coords) {
      if (!prevCoord) {
        prevCoord = coords;
      }
      $scope.session.distance += calculateDistance(prevCoord, coords);
      if (duration.asSeconds() > 0) {
        $scope.session.avgSpeed = ($scope.session.distance / duration.asSeconds()) * 3600;
      }
      prevCoord = coords;
    }

    function onChange(newPosition) {
      if (!elapsedTimer) { return; }
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      setSpeed(data);
      fileService.save(fileName, data, function () {}, function (error) { alert("Error file save");});
    }

    function toolTip() {
      if (!$scope.uploading) {
        $scope.uploadErrored = $scope.erroredCount > 0;
        $scope.uploadSucceded = $scope.erroredCount === 0;
        $scope.uploadMessage = ($scope.uploadSucceded) ? "Upload completed" : "Failed to upload " + $scope.erroredCount + " files";
        $timeout(function () {
          $scope.uploadErrored = false;
          $scope.uploadSucceded = false;
        }, 3000);
      }
    }

    function checkUploadFinished() {
      $scope.uploading = ($scope.totalFiles > $scope.erroredCount);
      $scope.uploadDisabled = $scope.totalFiles === 0 || $scope.uploading;
      toolTip();
    }

    function errHandler(error) {
      $scope.erroredCount += 1;
      checkUploadFinished();
    }

    function filesSaved(file) {
      if (file.remove) {
        file.remove();
      }
      $timeout(function () {
        $scope.totalFiles -= 1;
        checkUploadFinished();
      }, 100);
    }

    function uploadFiles(files) {
      $scope.uploading = true;
      $scope.uploadDisabled = true;
      filesToUpload(files);
      $scope.erroredCount = 0;
      checkUploadFinished();
      $timeout(function () {
        serverService.upload(files, filesSaved, errHandler);
      }, 100);
    }

    function checkUploadDisabledStatus() {
      $scope.uploadDisabled = $scope.totalFiles === 0;
    }

    function setTotalFilesTo(qty) {
      $scope.totalFiles = qty;
      checkUploadDisabledStatus();
    }

    function filesToUpload(files) {
      $timeout(function () {
        setTotalFilesTo(files.length);
      }, 10);
    }

    function padTime(val) {
      if (val < 10) {
        return "0" + val;
      }
      return val;
    }

    function displayDuration() {
      var hours = padTime(duration.get('hours'));
      var minutes = padTime(duration.get('minutes'));
      var seconds = padTime(duration.get('seconds'));
      if (hours === "00") {
        $scope.session.elapsed = minutes + ":" + seconds;
      } else {
        $scope.session.elapsed = hours + ":" + minutes;
      }
    }

    function startTimer() {
      duration = moment.duration(0);
      elapsedTimer = $interval(function () {
        duration.add(1, 's');
        displayDuration();
      }, 1000);
    }

    function stopTimer() {
      if (angular.isDefined(elapsedTimer)) {
        $interval.cancel(elapsedTimer);
        elapsedTimer = undefined;
      }
      resetSession();
    }

    $scope.upload = function () {
      fileService.list(uploadFiles, errHandler);
    };

    $scope.recording = function (on) {
      if (on) {
        fileName = String((new Date()).getTime());
        geoLocationService.start(onChange, function (err) { alert("Error geolocation service:" + JSON.stringify(err)); });
        startTimer();
      } else {
        geoLocationService.stop();
        setTotalFilesTo($scope.totalFiles + 1);
        stopTimer();
      }
    };

    $ionicPlatform.ready(function () {
      fileService.list(filesToUpload, errHandler);
    });

    resetSession();
  }]);