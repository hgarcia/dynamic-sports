var fileStorage = function (sessionName) {

  function getFS(sessionName, success, failure) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failure);
    function gotFS(fileSystem) {
      fileSystem.root.getFile(sessionName + ".json", {create: true, exclusive: false}, success, failure);
    }
  }

  return {
    write: function (data, success, failure) {
      function gotFileEntry(fileEntry) {
        fileEntry.createWriter(write, failure);
      }

      function write(writer) {
        writer.onwriteend = function (evt) {
          success(evt);
        };
        writer.write(data);
      }

      getFS(sessionName, gotFileEntry, failure);
    },
    read: function (success, failure) {
      function gotFileEntry(fileEntry) {
        fileEntry.file(readAsText, failure);
      }

      function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          success(evt.target.result);
        };
        reader.readAsText(file);
      }

      getFS(sessionName, gotFileEntry, failure);
    }
  };
};