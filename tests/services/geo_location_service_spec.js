/* global describe, beforeEach, it, module, inject */
describe("Geo Location services", function () {
  "use strict";
  var service, interval;

  beforeEach(module("dynamic-sports.services"));

  beforeEach(inject(function ($rootScope, $interval, _geoLocationService_) {
    service = _geoLocationService_;
    interval = $interval;
  }));

  describe("start(successCb, errorCb)", function () {
    var success = function () {};
    var error = function () {};

    it("should start watching the position", function () {
      service.start(success, error);
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it("should return an id for the started service", function () {
      var result = service.start(success, error);
      expect(result).not.toBeNull();
    });
  });

  describe("stop()", function () {
    beforeEach(function () {
      spyOn(interval, 'cancel');
    });

    it("should not call stop watching", function () {
      service.stop();
      expect(interval.cancel).not.toHaveBeenCalled();
    });

    it("should call clearWatch with the watchId", function () {
      service.start();
      service.stop();
      expect(interval.cancel).toHaveBeenCalled();
    });
  });
});