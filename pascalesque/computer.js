_CURRENT_ARRANGEMENT = [];
_PATHS = [];

previdx = curidx = 0;

importScripts("https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js");
importScripts("/pascal_triangle/pascalesque/path.js");

function compute_paths(_BLOCKED, _SKIP) {
    _PATHS = [];
    var _PER_BLOCK_COUNT = {};
    var c = {CURRENT_ARRANGEMENT: _CURRENT_ARRANGEMENT, PATHS: _PATHS, PER_BLOCK_COUNT: _PER_BLOCK_COUNT, BLOCKED: _BLOCKED, SKIP: _SKIP};
    for (i of _.range(_CURRENT_ARRANGEMENT[0].length)) {
      var start = new Elem(0, i, "right", c);
      start.compute_paths([start]);
    }
    previdx = curidx = 0;
    postMessage({type: "pathsComputed", numpaths: _PATHS.length, pbc: _PER_BLOCK_COUNT})
}


onmessage = function (m) {
  switch (m.data.type) {
    case "computePaths":
    _CURRENT_ARRANGEMENT = m.data.current_arrangement;
    compute_paths(m.data.blocked, m.data.skip);
    break;

    case "getNextPath":
    postMessage({type: "nextPath", prevpath: _PATHS[previdx].simplify(), path: _PATHS[curidx].simplify()})
    previdx = curidx;
    curidx = (curidx + 1) % _PATHS.length;
    break;
  }
}
