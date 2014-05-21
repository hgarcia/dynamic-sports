/* globals angular */
angular.module('dynamic-sports.services')
  .factory('geoLocationService', function () {
    'use strict';
    var watchId;
    return {
      start: function (success, error) {
        watchId = navigator.geolocation.watchPosition(success, error, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
        return watchId;
      },
      stop: function () {
        if (watchId) {
           navigator.geolocation.clearWatch(watchId);
        }
      }
    };
  });
