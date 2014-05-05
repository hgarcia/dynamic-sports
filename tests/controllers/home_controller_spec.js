/*global describe: true, beforeEach: true, it: true, expect: true, module: true, inject: true, spyOn */
describe("HomeCtrl", function () {
  "use strict";
  var scope, geoLocationService;

  beforeEach(module("dynamic-sports"));

  beforeEach(inject(function ($rootScope, $controller, _geoLocationService_) {
    scope = $rootScope.$new();
    geoLocationService = _geoLocationService_;
    $controller("HomeCtrl", {$scope: scope, geoLocationService: geoLocationService});
  }));

  describe("#recording()", function () {

    beforeEach(function () {
      spyOn(geoLocationService, "start");
      spyOn(geoLocationService, "stop");
    });

    it("should start recording if 'on' === true", function () {
      scope.recording(true);
      expect(geoLocationService.start).toHaveBeenCalled();
    });

    it("should stop recording if 'on' === false", function () {
      scope.recording(false);
      expect(geoLocationService.stop).toHaveBeenCalled();
    });
  });
});