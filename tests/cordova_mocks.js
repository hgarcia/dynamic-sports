//Geo location

navigator = {geolocation: {getCurrentPosition: jasmine.createSpy(), clearWatch: jasmine.createSpy()}};

// File
LocalFileSystem = {PERSISTENT: 1};

var requestFileSystemSuccessCb, requestFileSystemErrorCb, getFileSuccesCb, getFileErrorCb, fileSuccesCb, 
  fileErrorCb, writerCb, readEntriesSuccessCb, readEntriesErrorCb, uploadSuccesCb, uploadErrCb, getDirectorySuccessCb, getDirectoryErrorCb;
var directory = {
  getFile: function (fileName, options, successCb, errorCb) {
    getFileSuccesCb = successCb;
    getFileErrorCb = errorCb;
  },
  createReader: function () {
    return reader;
  },
  getDirectory: function (fileSytem, options, successCb, errorCb) {
    getDirectorySuccessCb = successCb;
    getDirectoryErrorCb = errorCb;
  }
};
var fileSystem = {
  root: directory
};

var writer = {
  seek: function () {},
  length: 0,
  write: function (data) {
    this.onwriteend();
  }
};

var reader = {
  readEntries: function (successCb, errorCb) {
    readEntriesSuccessCb = successCb;
    readEntriesErrorCb = errorCb;
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

function FileReader() {
  this.readAsText = function (file) {
    if (this.onloadend) {
      this.onloadend({target: {result: file}});
    } 
  };
}

function FileUploadOptions() {
  return {};
}

var fileTransferUploadSpy = jasmine.createSpy();

function FileTransfer() {
  return {
    upload: fileTransferUploadSpy
  };
}

window.onFileTransferSuccess = function () {
  fileTransferUploadSpy.mostRecentCall.args[2]();
};

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
    OnGetDirectorySuccess: function () {
      if (getDirectorySuccessCb) {
        getDirectorySuccessCb(directory);
      }
      return { 
        OnReadEntriesError: function () {
          if (readEntriesErrorCb) {
            readEntriesErrorCb();
          }
        },
        OnReadEntriesSuccess: function (result) {
          if (readEntriesSuccessCb) {
            readEntriesSuccessCb(result);
          }
        },
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
    }
  };
};