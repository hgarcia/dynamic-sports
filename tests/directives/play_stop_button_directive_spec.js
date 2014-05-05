/*global jasmine, describe, beforeEach, it, expect, module, inject */
describe("PlayStopButtonController", function () {
  "use strict";
  var scope, controller, directive;

  beforeEach(module("dynamic-sports.directives"));

  beforeEach(inject(function ($rootScope, $controller, playStopButtonDirective) {
    scope = $rootScope.$new();
    controller = $controller;
    directive = playStopButtonDirective[0];
    controller("PlayStopButtonController", {$scope: scope});
  }));

  describe("directive creation", function () {
    
    it("should use the PlayStopButtonController controller", function () {
      expect(directive.controller).toEqual("PlayStopButtonController");
    });

    it("should use the BirthDate template", function () {
      expect(directive.templateUrl).toEqual("templates/directives/play-stop-button.html");
    });

    it("should be an element", function () {
      expect(directive.restrict).toEqual("E");
    });

    it("should replace content", function () {
      expect(directive.replace).toBeFalsy();
    });
  });

  describe("click()", function () {

    beforeEach(function () {
      scope.isOn = false;
      scope.clickHandler = jasmine.createSpy();
      scope.click();
    });

    it("should set 'isOn' to true", function () {
      expect(scope.isOn).toBeTruthy();
    });

    it("should call the given clickHandler with the value of 'isOn'", function () {
      expect(scope.clickHandler).toHaveBeenCalledWith(true);
    });

    it("should not throw if a clickHandler is not provided", function () {
      scope.clickHandler = undefined;
      expect(scope.click).not.toThrow();
    });
  });
});