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
