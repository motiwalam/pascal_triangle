_CURRENT_ARRANGEMENT = [];
_PATHS = [];

MEMSIZE_ELEM = 25;  // bytes

PREVIDX = CURIDX = 0;

importScripts("https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js");
importScripts("/pascal_triangle/pascalesque/path.js?" + Math.random());

function compute_paths(memlimit, current_arrangement, blocked, skip) {
    _PATHS = [];
    var _PER_BLOCK_COUNT = {};

    var c = {
      CURRENT_ARRANGEMENT: current_arrangement,
      PATHS: _PATHS,
      PER_BLOCK_COUNT: _PER_BLOCK_COUNT,
      BLOCKED: blocked,
      SKIP: skip,
      MAX_PATHS: (memlimit / MEMSIZE_ELEM) / (current_arrangement.length)
    };

    if (current_arrangement.length > 0) {
      for (i of _.range(current_arrangement[0].length)) {
        var start = new Elem(0, i, "right", c);
        start.compute_paths([start]);
      }

      PREVIDX = CURIDX = 0;
      postMessage({
        type: "pathsComputed",
        numpaths: _PATHS.length,
        pbc: _PER_BLOCK_COUNT
      });

    }
}

function pascal(n) {

    function rowpascal(_n) {
      var out = [1].concat(Array(_n));

      ndiv2 = Math.floor(_n/2);
      var rcoeff = BigInt(1);

      _.map( _.range(1, _n+1), (i) => {out[i] = (i > ndiv2 ? out[_n - i] : (rcoeff = (rcoeff * BigInt(_n-i+1))/BigInt(i) ))} )

      return out;
    }

    return _.map(_.range(n), (j)=>{return rowpascal(j)});
}

onmessage = function (m) {
  switch (m.data.type) {
    case "computePaths":
    compute_paths(m.data.memlimit, m.data.current_arrangement, m.data.blocked, m.data.skip);
    break;

    case "getNextPath":
    postMessage({
      type: "nextPath",
      prevpath: _PATHS[PREVIDX].simplify(),
      path: _PATHS[CURIDX].simplify()
    });
    PREVIDX = CURIDX;
    CURIDX = (CURIDX + 1) % _PATHS.length;
    break;

    case "destroyPaths":
    _PATHS = null;
    break;

    case "computePascal":
    var doReverse = m.data.doreverse;
    var t = pascal(m.data.row);
    postMessage({
      type: "pascalComputed",
      tri: doReverse ? t.reverse() : t,
      docompute: m.data.docompute,
      doreverse: doReverse,
    });
    break;
  }
}
