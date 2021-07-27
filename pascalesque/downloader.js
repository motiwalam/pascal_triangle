_PREVIOUS_OBJECT_URL = "";


function save_arrangement(arrangement) {
  var data = new Blob(
    [arrangement.map(row => row.join(" ")).join("\n") + "\n"],
    {type: "text/plain"}
  );

  // never keep more than one url active at a time, definitely
  // smarter ways to do this but oh well
  if (_PREVIOUS_OBJECT_URL !== null) {
    self.URL.revokeObjectURL(_PREVIOUS_OBJECT_URL);
  }

  _PREVIOUS_OBJECT_URL = self.URL.createObjectURL(data);
  return _PREVIOUS_OBJECT_URL;
}

addEventListener('message', m => {
    switch(m.data.type) {
      case "createDownloadURL":
      var url = save_arrangement(m.data.current_arrangement);
      postMessage({
        type: "urlCreated",
        url : url,
        suggested: m.data.suggested,
      })
    }
});
