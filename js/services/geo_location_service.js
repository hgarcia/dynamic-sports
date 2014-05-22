/* globals angular */
angular.module('dynamic-sports.services')
  .factory('geoLocationService', ['$interval', function ($interval) {
    'use strict';
    var watchId;

    return {
      start: function (success, error) {
        watchId = $interval(function () {
          navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});
        }, 1000);
      },
      stop: function () {
        if (watchId) {
          $interval.cancel(watchId);
        }
      }
    };
  }]);
