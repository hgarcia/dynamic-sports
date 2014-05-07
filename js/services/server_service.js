/* globals angular */
angular.module('dynamic-sports.services')
  .factory('serverService', function () {
    'use strict';

    function getFileUploadOptions(fileURI) {
      var options = new FileUploadOptions();
      options.fileName = fileURI.substr(fileURI.lastIndexOf('/')+1);
      options.mimeType = "text/plain";
      return options;
    }
    return {
      upload: function (files, onSuccess, onError) {
        var ft =  new FileTransfer();
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          ft.upload(file.fullPath, encodeURI("http://pacific-taiga-3446.herokuapp.com/uploads"), onSuccess, onError, getFileUploadOptions(file.fullPath));
        }
      }
    };
  });
