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