/* globals angular, console */
angular.module('dynamic-sports.controllers')
  .controller('HomeCtrl', ['$scope', '$timeout', '$ionicPlatform', 'geoLocationService', 'fileService', 'serverService',
    function ($scope, $timeout, $ionicPlatform, geoLocationService, fileService, serverService) {
    'use strict';
    var fileName;
    $scope.uploading = false;
    $scope.uploadDisabled = false;

    function onChange(newPosition) {
      var data = newPosition.coords;
      data.timestamp = newPosition.timestamp;
      fileService.save(fileName, data, function () {}, function (error) {});
    }

    function checkUploadFinished() {
      $scope.uploading = ($scope.totalFiles > $scope.erroredCount);
      $scope.uploadDisabled = $scope.totalFiles === 0 || $scope.uploading;
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
        hideLoading();
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