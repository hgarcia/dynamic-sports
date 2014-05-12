/*global describe: true, beforeEach: true, it: true, expect: true, module: true, inject: true, spyOn */
describe("HomeCtrl", function () {
  "use strict";
  var scope, geoLocationService, fileService, serverService, timeout;

  beforeEach(module("dynamic-sports"));

  beforeEach(inject(function ($rootScope, $controller, $timeout, _geoLocationService_, _fileService_, _serverService_) {
    scope = $rootScope.$new();
    geoLocationService = _geoLocationService_;
    timeout = $timeout;
    fileService = _fileService_;
    serverService = _serverService_;
    $controller("HomeCtrl", {$scope: scope, $timeout: timeout, geoLocationService: geoLocationService, fileService: fileService});
  }));

  describe("#upload()", function () {

    it("should use the serverService to upload the files", function () {
      spyOn(serverService, "upload");
      var payload = [{name: "file-name-1"}, {name: "file-name-2"}, {name: "file-name-3"}];
      spyOn(fileService, "list");
      scope.upload();
      fileService.list.mostRecentCall.args[0](payload);
      expect(serverService.upload).toHaveBeenCalled();
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
      var payload = {coords: {}, timestamp: "time-stamp-here"};
      geoLocationService.start.mostRecentCall.args[0](payload);
      expect(fileService.save).toHaveBeenCalled();
    });
  });

  describe("#recording() stop", function () {

    beforeEach(function () {
      spyOn(geoLocationService, "stop");
      scope.recording(false);
    });

    it("should stop recording if 'on' === false", function () {
      expect(geoLocationService.stop).toHaveBeenCalled();
    });
  });
});