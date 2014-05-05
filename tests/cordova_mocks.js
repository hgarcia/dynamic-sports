//Geo location

navigator = {geolocation: {watchPosition: jasmine.createSpy().andReturn("12345"), clearWatch: jasmine.createSpy()}};

// File
LocalFileSystem = {PERSISTENT: 1};

var requestFileSystemSuccessCb, requestFileSystemErrorCb, getFileSuccesCb, getFileErrorCb, fileSuccesCb, fileErrorCb, writerCb;
var fileSystem = {
  root: {
    getFile: function (fileName, options, successCb, errorCb) {
      getFileSuccesCb = successCb;
      getFileErrorCb = errorCb;
    }
  }
};

var writer = {
  seek: function () {},
  length: 0,
  write: function (data) {
    this.onwriteend();
  }
};

var fileEntry = {
  file: function (successCb, errorCb) {
    fileSuccesCb = successCb;
    fileErrorCb = errorCb;
  },
  createWriter: function (cb) {
    writerCb = cb;
  }
};

function FileReader () {
  this.readAsText = function (file) {
    if (this.onloadend) {
      this.onloadend({target: {result: file}});
    } 
  };
}

window.requestFileSystem = function (cons1, cons2, successCb, errorCb) {
  requestFileSystemSuccessCb = successCb;
  requestFileSystemErrorCb = errorCb;
};

window.OnRequestFileSystemError = function () {
  if (requestFileSystemErrorCb) {
    requestFileSystemErrorCb();
  }
};

window.OnRequestFileSystemSuccess = function () {
  if (requestFileSystemSuccessCb) {
    requestFileSystemSuccessCb(fileSystem);
  }
  return {
    OnGetFileError: function () {
      if (getFileErrorCb) {
        getFileErrorCb();
      }
    },
    OnGetFileSuccess: function () {
      if (getFileSuccesCb) {
        getFileSuccesCb(fileEntry);
      }
      return {
        OnWriteSuccess: function () {
          writerCb(writer);
        },
        OnFileEntryError: function () {
          if (fileErrorCb) {
            fileErrorCb();
          }
        },
        OnFileEntrySuccess: function (content) {
          if (fileSuccesCb) {
            fileSuccesCb(content);
          }
        }
      };
    }
  };
};