/* global describe, beforeEach, it, module, inject */
describe("Geo Location services", function () {
  "use strict";
  var scope, service;

  beforeEach(module("dynamic-sports.services"));

  beforeEach(inject(function ($rootScope, _geoLocationService_) {
    scope = $rootScope.$new();
    service = _geoLocationService_;
  }));

  describe("start(successCb, errorCb)", function () {

    it("should start watching the position", function () {
      var success = function () {};
      var error = function () {};
      service.start(success, error);
      expect(navigator.geolocation.watchPosition).toHaveBeenCalledWith(success, error);
    });
  });

  describe("stop()", function () {

    it("should not call clearWatch if we are not watching", function () {
      service.stop();
      expect(navigator.geolocation.clearWatch).not.toHaveBeenCalled();
    });

    it("should call clearWatch with the watchId", function () {
      service.start();
      service.stop();
      expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith("12345");
    });
  });
});