/* global describe, beforeEach, it, module, inject, navigator */
describe("File services", function () {
  "use strict";
  var scope, service, successCb, errorCb;

  beforeEach(module("dynamic-sports.services"));

  beforeEach(inject(function ($rootScope, _serverService_) {
    scope = $rootScope.$new();
    service = _serverService_;
    successCb = jasmine.createSpy();
    errorCb = jasmine.createSpy();
  }));

  describe("upload(files, successCb, errorCb)", function () {

    it("should call the successCb on success", function () {
      service.upload([{fullPath: "/path/to/file", toURL: function () { return "/path/to/file";}}], successCb, errorCb);
      onFileTransferSuccess();
      expect(successCb).toHaveBeenCalled();  
    });
  });
});