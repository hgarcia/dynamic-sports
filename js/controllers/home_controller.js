/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', '$timeout', '$interval', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
    function ($scope, $timeout, $interval, $ionicPlatform, geoLocationService, fileService, serverService) {
    'use strict';
    var fileName;
    var elapsedTimer;
    var duration;
    var RADIANT_CONSTANT = 0.0174532925199433;
    var KM_RATIO = 6371;

    $scope.uploading = false;
    $scope.uploadDisabled = false;
    $scope.uploadErrored = false;
    $scope.uploadSucceded = false;
    $scope.uploadMessage = "";
    $scope.totalFiles = 0;

    function resetSession() {
      $scope.session = {maxSpeed: 0, curSpeed: 0, elapsed: "00:00"};
    }

    function toKmPerHour(meterPerSecond) {
      return String(meterPerSecond * 3.6).substring(0, 3);
    }

    function toRad() {
      return (value * RADIANT_CONSTANT);
    }

    function getDistance(lat1, lat2, lon1, lon2) {
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1Rad = toRad(lat1);
      var lat2Rad = toRad(lat2);
      
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
      
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return KM_RATIO * c;
    }

    function setSpeed(speed) {
      if (speed >= 0) {
        $scope.session.curSpeed = toKmPerHour(speed);
      }
      if ($scope.session.curSpeed > $scope.session.maxSpeed) {
        $scope.session.maxSpeed = toKmPerHour(speed);
      }
    }

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      setSpeed(data.speed);
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
        $scope.session.elapsed = hours + ":" + minutes + ":" + seconds;
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
        fileName = geoLocationService.start(onChange, function (err) { alert("Error geolocation service"); });
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