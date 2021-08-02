var _CURRENT_ARRANGEMENT = [];
var _PATHS = [];

var MEMSIZE_ELEM = 25;  // bytes

var PREVIDX = 0,
    CURIDX = 0;

importScripts("https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js");
importScripts("/pascal_triangle/pascalesque/path.js");

function compute_paths(opts) {
    _PATHS = [];

    var c = {
      CURRENT_ARRANGEMENT: opts.current_arrangement,
      PATHS: _PATHS,
      PER_BLOCK_COUNT: {},
      BLOCKED: opts.blocked,
      SKIP: opts.skip,
      MAX_PATHS: (opts.memlimit / MEMSIZE_ELEM) / (opts.current_arrangement.length),
      PATH_COUNT: 0,
      EVERYNTHPATH: opts.everynthpath,
      DO_TRIM: opts.dotrim,
    };

    if (opts.current_arrangement.length > 0) {
      for (var i of _.range(opts.current_arrangement[0].length)) {
        var start = new Elem(0, i, "right", c);
        start.compute_paths([start]);
      }

      PREVIDX = CURIDX = 0;
      postMessage({
        type: "pathsComputed",
        numpaths: c.PATH_COUNT,
        pbc: c.PER_BLOCK_COUNT
      });

      _PATHS = c.PATHS;

    }
}


self.addEventListener('message', m => {
  switch (m.data.type) {
    case "computePaths":
    compute_paths({
      memlimit: m.data.memlimit,
      current_arrangement: m.data.current_arrangement,
      blocked: m.data.blocked,
      skip: m.data.skip,
      everynthpath: m.data.everynthpath,
      dotrim: m.data.dotrim,
    });
    break;

    case "getNextPath":
    if (_PATHS.length > 0) {
      postMessage({
        type: "nextPath",
        prevpath: _PATHS[PREVIDX].simplify(),
        path: _PATHS[CURIDX].simplify()
      });
      PREVIDX = CURIDX;
      CURIDX = (CURIDX + 1) % _PATHS.length;

    }
    break;

    case "destroyPaths":
    _PATHS = null;
    break;

  }
})
