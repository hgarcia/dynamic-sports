/* globals angular */
angular.module('dynamic-sports.services')
  .factory('fileService', function () {
  'use strict';

    function writeToFile(data, successCb) {
      return function (writer) {
        writer.onwriteend = function(evt) {
          if (successCb) {
            successCb();
          }
        };
        writer.seek(writer.length);
        writer.write(JSON.stringify(data));
      };
    }

    function gotFileEntry(data, successCb, errorCb) {
      return function(fileEntry) {
        fileEntry.createWriter(writeToFile(data, successCb), errorCb);
      };
    }

    function write(fileName, data, successCb, errorCb) {
      return function (fileSystem) {
        getCreateDir(fileSystem.root, function (dir) {
          dir.getFile(fileName, {create: true, exclusive: false}, gotFileEntry(data, successCb, errorCb), errorCb);
        }, errorCb);
      };
    }

    function getCreateDir(entry, successCb, errorCb) { 
      entry.getDirectory("dynsports", {create: true, exclusive: false}, successCb, errorCb); 
    }

    function fileContents(successCb) {
      return function (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
          successCb(evt.target.result);
        };
        reader.readAsText(file);
      };
    }

    function readFile(successCb, errorCb) {
      return function (fileEntry) {
        fileEntry.file(fileContents(successCb), errorCb);
      };
    }

    function read(fileName, successCb, errorCb) {
      return function (fileSystem) {
        getCreateDir(fileSystem.root, function (dir) {
          dir.getFile(fileName, null, readFile(successCb, errorCb), errorCb);
        }, errorCb);
      };
    }

    function list(successCb, errorCb) {
      return function (fileSystem) {
        getCreateDir(fileSystem.root, function (dir) {
          var reader = dir.createReader();
          reader.readEntries(successCb, errorCb);
        }, errorCb);
      };
    }

    return {
      list: function (successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, list(successCb, errorCb), errorCb);
      },
      save: function (fileName, data, successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, write(fileName, data, successCb, errorCb), errorCb);
      },
      open: function (fileName, successCb, errorCb) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, read(fileName, successCb, errorCb), errorCb);
      }
    };
  });
