/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', '$timeout', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
    function ($scope, $timeout, $ionicPlatform, geoLocationService, fileService, serverService) {
    'use strict';
    var fileName;
    $scope.uploading = false;
    $scope.uploadDisabled = false;
    $scope.uploadErrored = false;
    $scope.uploadSucceded = false;
    $scope.uploadMessage = "";

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      fileService.save(fileName, data, function () {}, function (error) {});
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

    function filesSaved() {
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

    function filesToUpload(files) {
      $timeout(function () {
        $scope.totalFiles = files.length;
        $scope.uploadDisabled = $scope.totalFiles === 0;
      }, 10);
    }

    $scope.upload = function () {
      fileService.list(uploadFiles, errHandler);
    };

    $scope.recording = function (on) {
      if (on) {
        fileName = geoLocationService.start(onChange, errHandler);
      } else {
        geoLocationService.stop();
        $scope.totalFiles += 1;
        $scope.uploadDisabled = false;
      }
    };

    $ionicPlatform.ready(function () {
      fileService.list(filesToUpload, errHandler);
    });
  }]);