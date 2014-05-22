/*global describe: true, beforeEach: true, it: true, expect: true, module: true, inject: true, spyOn */
describe("HomeCtrl", function () {
  "use strict";
  var scope, geoLocationService, fileService, serverService, timeout, interval;

  beforeEach(module("dynamic-sports"));

  beforeEach(inject(function ($rootScope, $controller, $timeout, $interval, $httpBackend, _geoLocationService_, _fileService_, _serverService_) {
    scope = $rootScope.$new();
    geoLocationService = _geoLocationService_;
    timeout = $timeout;
    interval = $interval;
    fileService = _fileService_;
    serverService = _serverService_;
    $httpBackend.whenGET().respond(200, 'mock data');
    $controller("HomeCtrl", {$scope: scope, $timeout: timeout, $interval: interval, geoLocationService: geoLocationService, fileService: fileService});
  }));

  describe("#distance()", function () {
    it("should be 3 meters", function () {
      var str = {latitude: 43.64241221061246, longitude: -79.37423813140495};
      var end = {latitude: 43.6424056308755 , longitude: -79.37427474668694};
      var res = scope.distance(str, end);
      expect(res).toEqual(0.0030358192690878322);
    });
  });

  describe("#upload()", function () {

    it("should use the serverService to upload the files", function () {
      spyOn(serverService, "upload");
      var payload = [{name: "file-name-1"}, {name: "file-name-2"}, {name: "file-name-3"}];
      spyOn(fileService, "list");
      scope.upload();
      fileService.list.mostRecentCall.args[0](payload);
    });
  });

  describe("#recording() start", function () {

    beforeEach(function () {
      spyOn(geoLocationService, "start").andReturn("123456");
      spyOn(fileService, "save");
      scope.recording(true);
    });

    it("should start recording", function () {
      expect(geoLocationService.start).toHaveBeenCalled();
    });

    it("should call the fileService.save method", function () {
      var payload = {coords: {speed: 1}, timestamp: "time-stamp-here"};
      geoLocationService.start.mostRecentCall.args[0](payload);
      expect(fileService.save).toHaveBeenCalled();
    });

    it("should start to calculate elapsed time", function () {
      interval.flush(1000);
      expect(scope.session.elapsed).toEqual("00:01");
      interval.flush(1000);
      expect(scope.session.elapsed).toEqual("00:02");
      interval.flush(1000 * 60);
      expect(scope.session.elapsed).toEqual("01:02");
    });
  });

  describe("#recording() stop", function () {

    beforeEach(function () {
      spyOn(geoLocationService, "stop");
      spyOn(interval, 'cancel');
      scope.recording(true); //We need to start the timer first.
      interval.flush(1000);
      scope.recording(false);
    });

    it("should stop recording if 'on' === false", function () {
      expect(geoLocationService.stop).toHaveBeenCalled();
    });

    it("should increase the number of files to upload", function () {
      expect(scope.totalFiles).toEqual(1);
    });

    it("should enable upload", function () {
      expect(scope.uploadDisabled).toBeFalsy();
    });

    it("should stop the timer", function () {
      expect(interval.cancel).toHaveBeenCalled();
    });

    it("should reset elapsed time", function () {
      expect(scope.session.elapsed).toEqual("00:00");
    });

    it("should reset avg speed", function () {
      expect(scope.session.avgSpeed).toEqual(0);
    });

    it("should reset distance", function () {
      expect(scope.session.distance).toEqual(0);
    });
  });
});